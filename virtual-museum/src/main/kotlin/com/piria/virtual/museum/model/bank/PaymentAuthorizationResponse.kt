package com.piria.virtual.museum.model.bank

data class PaymentAuthorizationResponse(
    val message: String,
    val jwtPaymentToken: String?
)
