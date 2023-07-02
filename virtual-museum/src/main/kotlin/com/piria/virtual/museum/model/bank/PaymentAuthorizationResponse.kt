package com.piria.virtual.museum.model.bank

import org.springframework.http.HttpStatusCode

data class PaymentAuthorizationResponse(
    val status: HttpStatusCode,
    val message: String,
    val jwtPaymentToken: String?
)
