package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.PaymentRequiredInfo
import com.piria.virtual.museum.model.Ticket
import com.piria.virtual.museum.service.*
import com.piria.virtual.museum.util.JwtTokenUtil
import com.piria.virtual.museum.util.TicketAsPDFGenerator
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.codec.ServerSentEvent
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.util.*
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/api/ticket")
@CrossOrigin(originPatterns = ["*"])
@EnableScheduling
data class TicketApi(val userService: UserService,
                     val bankService: BankClientService,
                     val virtualVisitService: VirtualVisitService,
                     val museumService: MuseumService,
                     val ticketService: TicketService,
                     val emailService: EmailService,
                     val jwtTokenUtil: JwtTokenUtil,
                     val ticketAsPDFGenerator: TicketAsPDFGenerator
) {
    val jobExecutionMap = ConcurrentHashMap<String, Flux<String>>()

    @PostMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
    fun buyTicket(@RequestBody ticketRequest: TicketRequest, @RequestHeader(HttpHeaders.AUTHORIZATION) authorizationHeader: String): Map<String, String> {
        val jobId = UUID.randomUUID().toString();
        val jobFlux = Flux.push<String> {emitter ->
            try {
                emitter.next("Step 1 - Parsing data...")

                val (virtualVisitId, paymentRequiredInfo) = ticketRequest
                val (paymentAuthorizationRequest, paymentRequest) = paymentRequiredInfo.createRequests()

                Thread.sleep(5000)
                emitter.next("Step 2 - Authenticating user on bank service...")

                // Contact bank for payment
                val (authStatus, authMessage, jwtPaymentToken) = bankService.authenticatePayment(paymentAuthorizationRequest)
                if(!authStatus.is2xxSuccessful) {
                    emitter.next("Error - $authMessage")
                    emitter.complete()
                    return@push
                }

                Thread.sleep(5000)
                emitter.next("Step 3 - Paying on bank service...")

                val (paymentStatus, paymentMessage) = bankService.payment(paymentRequest, "Bearer $jwtPaymentToken")
                if(!paymentStatus.is2xxSuccessful) {
                    emitter.next("Error - $paymentMessage")
                    emitter.complete()
                    return@push
                }

                Thread.sleep(5000)
                emitter.next("Step 4 - Creating ticket for visit...")

                val virtualVisit = virtualVisitService.getById(virtualVisitId!!);
                val ticket = ticketService.save(Ticket(virtualVisit = virtualVisit))

                val ticketId = ticket.id!!
                val ticketPdfResource = ticketAsPDFGenerator.generate(
                    ticketId = ticketId,
                    museum = museumService.getMuseumsById(virtualVisit.museum.id!!)
                )

                emitter.next("Step 5 - Sending ticket via mail...")

                emailService.sendEmailWithAttachment(
                    to = getEmailUsingAuthorizationHeader(authorizationHeader),
                    subject = "Virtual Museum Visit Ticket",
                    body = """
                    <!--suppress HtmlRequiredLangAttribute -->
                    <html>
                        <body>
                            <h3>Dear Visitor,</h3>
                            <p>Thank you for purchasing a ticket for the virtual museum visit.</p>
                            <p>Your ticket code is: <strong>$ticketId</strong></p>
                            <p>Please use this code to access the virtual museum.</p>
                            <p>Enjoy your visit!</p>
                            <br>
                            <p>Best regards,</p>
                            <p>The Museum Team</p>
                        </body>
                    </html>
                    """.trimIndent(),
                    attachmentData = ticketPdfResource,
                    attachmentName = "ticket-${ticketId}.pdf"
                )

                emitter.complete()
            } catch (e: Exception) {
                emitter.next("Error - ${e.message}")
                emitter.complete()
            }
        }
        jobExecutionMap[jobId] = jobFlux
        return mapOf(Pair("jobId", jobId))
    }

    @GetMapping(value = ["/job/{jobId}"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun buyTicket(@PathVariable jobId: String): Flux<ServerSentEvent<String>> {
        return (jobExecutionMap[jobId] ?: Flux.just("Error - JobId $jobId does not exist."))
            .map { ServerSentEvent.builder(it).build() }
    }

    private fun getEmailUsingAuthorizationHeader(authorizationHeader: String): String {
        val usernameFromToken = jwtTokenUtil.getUsernameFromToken(authorizationHeader.split(" ")[1])
        val user = userService.loadUserByUsername(usernameFromToken)
        return user.email
    }

    data class TicketRequest(
        val virtualVisitId: Long? = null,
        val paymentRequiredInfo: PaymentRequiredInfo = PaymentRequiredInfo()
    )
}
