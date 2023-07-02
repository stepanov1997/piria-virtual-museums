package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.PaymentRequiredInfo
import com.piria.virtual.museum.service.BankClientService
import com.piria.virtual.museum.service.EmailService
import com.piria.virtual.museum.service.MuseumService
import com.piria.virtual.museum.service.UserService
import com.piria.virtual.museum.util.JwtTokenUtil
import com.piria.virtual.museum.util.TicketAsPDFGenerator
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.util.*

@RestController
@RequestMapping("/api/ticket")
@CrossOrigin(originPatterns = ["*"])
data class TicketApi(val userService: UserService,
                     val bankService: BankClientService,
                     val museumService: MuseumService,
                     val emailService: EmailService,
                     val jwtTokenUtil: JwtTokenUtil,
                     val ticketAsPDFGenerator: TicketAsPDFGenerator
) {

    @PostMapping(produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun buyTicket(@RequestBody ticketRequest: TicketRequest, @RequestHeader(HttpHeaders.AUTHORIZATION) authorizationHeader: String) =
        Flux.create {emitter ->
            try {
                emitter.next("Step 1 - Parsing data...")

                val (museumId, paymentRequiredInfo) = ticketRequest
                val (paymentAuthorizationRequest, paymentRequest) = paymentRequiredInfo.createRequests()

                emitter.next("Step 2 - Authenticating user on bank service...")

                // Contact bank for payment
                val (authStatus, authMessage, jwtPaymentToken) = bankService.authenticatePayment(paymentAuthorizationRequest)
                if(!authStatus.is2xxSuccessful) {
                    emitter.next("Error - $authMessage")
                    return@create
                }

                emitter.next("Step 3 - Paying on bank service...")

                val (paymentStatus, paymentMessage) = bankService.payment(paymentRequest, "Bearer $jwtPaymentToken")
                if(!paymentStatus.is2xxSuccessful) {
                    emitter.next("Error - $paymentMessage")
                    return@create
                }

                emitter.next("Step 4 - Creating ticket for visit...")

                val ticketId = UUID.randomUUID().toString()
                val ticketPdfResource = ticketAsPDFGenerator.generate(
                    ticketId = ticketId,
                    museum = museumService.getMuseumsById(museumId)
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
            }
        }

    private fun getEmailUsingAuthorizationHeader(authorizationHeader: String): String {
        val usernameFromToken = jwtTokenUtil.getUsernameFromToken(authorizationHeader.split(" ")[1])
        val user = userService.loadUserByUsername(usernameFromToken)
        return user.email
    }

    data class TicketRequest(
        val museumId: Long,
        val paymentRequiredInfo: PaymentRequiredInfo
    )
}
