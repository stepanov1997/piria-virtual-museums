package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.bank.PaymentAuthorizationRequest
import com.piria.virtual.museum.model.bank.PaymentAuthorizationResponse
import com.piria.virtual.museum.model.bank.PaymentRequest
import com.piria.virtual.museum.model.bank.PaymentResponse
import org.springframework.http.HttpHeaders.AUTHORIZATION
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.service.annotation.PostExchange

interface BankClientService {
    @PostExchange("/authenticatePayment")
    fun authenticatePayment(@RequestBody paymentAuthorizationRequest: PaymentAuthorizationRequest) : PaymentAuthorizationResponse
    @PostExchange("/payment")
    fun payment(@RequestBody paymentRequest: PaymentRequest, @RequestHeader(AUTHORIZATION) authorizationHeader: String) : PaymentResponse
}

