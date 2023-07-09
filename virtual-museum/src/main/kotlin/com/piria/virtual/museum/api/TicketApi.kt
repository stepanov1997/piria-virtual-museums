package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.PaymentRequiredInfo
import com.piria.virtual.museum.model.Response
import com.piria.virtual.museum.model.Ticket
import com.piria.virtual.museum.service.*
import com.piria.virtual.museum.util.JwtTokenUtil
import com.piria.virtual.museum.util.TicketAsPDFGenerator
import mu.KotlinLogging
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/ticket")
@CrossOrigin(originPatterns = ["*"])
data class TicketApi(
    val userService: UserService,
    val bankService: BankClientService,
    val virtualVisitService: VirtualVisitService,
    val museumService: MuseumService,
    val ticketService: TicketService,
    val emailService: EmailService,
    val jwtTokenUtil: JwtTokenUtil,
    val ticketAsPDFGenerator: TicketAsPDFGenerator
) {
    private val log = KotlinLogging.logger {}

    @Suppress("HtmlRequiredLangAttribute")
    @PostMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
    fun buyTicket(
        @RequestBody ticketRequest: TicketRequest,
        @RequestHeader(HttpHeaders.AUTHORIZATION) authorizationHeader: String
    ): ResponseEntity<*> {
        try {
            log.info { "Step 1 - Parsing data..." }

            val (virtualVisitId, paymentRequiredInfo) = ticketRequest
            val (paymentAuthorizationRequest, paymentRequest) = paymentRequiredInfo.createRequests()

            log.info { "Step 2 - Authenticating user on bank service..." }

            // Contact bank for payment
            val (authStatus, authMessage, jwtPaymentToken) = bankService.authenticatePayment(paymentAuthorizationRequest)
            if (!authStatus.is2xxSuccessful) {
                log.error { "Error - $authMessage" }
                return Response.generateErrorResponse(authStatus, authMessage)
            }

            log.info { "Step 3 - Paying on bank service..." }

            val (paymentStatus, paymentMessage) = bankService.payment(paymentRequest, "Bearer $jwtPaymentToken")
            if (!paymentStatus.is2xxSuccessful) {
                log.error { "Error - $paymentMessage" }
                return Response.generateErrorResponse(paymentStatus, paymentMessage)
            }

            log.info { "Step 4 - Creating ticket for visit..." }

            val username = jwtTokenUtil.getUsernameUsingAuthorizationHeader(authorizationHeader)
            val user = userService.loadUserByUsername(username)

            val virtualVisit = virtualVisitService.getById(virtualVisitId!!);
            val ticket = ticketService.save(Ticket(virtualVisit = virtualVisit, user = user))

            val ticketId = ticket.id!!
            val ticketPdfResource = ticketAsPDFGenerator.generate(
                ticketId = ticketId,
                virtualVisit = virtualVisit
            )

            log.info { "Step 5 - Sending ticket via mail..." }

            emailService.sendEmailWithAttachment(
                to = user.email,
                subject = "Virtual Museum Visit Ticket",
                body = """
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

            log.info { "Successed buying ticket." }
            return Response.generateValidResponse(mapOf<String, String>())
        } catch (e: Exception) {
            log.error { "Error while buying ticket - ${e.message}" }
            return Response.generateErrorResponse(HttpStatus.BAD_REQUEST, e.message!!)
        }
    }

    data class TicketRequest(
        val virtualVisitId: Long? = null,
        val paymentRequiredInfo: PaymentRequiredInfo = PaymentRequiredInfo()
    )

}