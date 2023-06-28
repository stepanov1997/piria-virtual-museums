package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Response
import com.piria.virtual.museum.model.TicketRequest
import com.piria.virtual.museum.service.BankClientService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ticket")
@CrossOrigin(originPatterns = ["*"])
data class TicketApi(val bankService: BankClientService) {

    @PostMapping
    fun buyTicket(@RequestBody ticketRequest: TicketRequest): Any {
        var errorMessage: String? = null
        return try {
            val (paymentAuthorizationRequest, paymentRequest) = ticketRequest.createRequests();
            val (message, jwtPaymentToken) = bankService.authenticatePayment(paymentAuthorizationRequest)
            errorMessage = message
            val paymentResponse = bankService.payment(paymentRequest, "Bearer $jwtPaymentToken")
            Response.generateValidResponse(paymentResponse)
        } catch (e: Exception) {
            Response.generateErrorResponse(HttpStatus.BAD_REQUEST, errorMessage ?: "")
        }
    }
}
