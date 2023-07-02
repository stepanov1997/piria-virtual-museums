package com.piria.virtual.museum.model.bank

import org.springframework.http.HttpStatusCode

data class PaymentResponse(
    val status: HttpStatusCode,
    val message: String
)
