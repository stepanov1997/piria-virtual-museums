package com.piria.virtual.museum.model.bank

data class PaymentRequest(
    val receiverCardNumber: String,
    val amount: Double
)
