package com.piria.virtual.museum.model.bank

data class PaymentAuthorizationRequest(
    val cardHolderFirstName: String,
    val cardHolderSurname: String,
    val cardNumber: String,
    val cardType: CardType,
    val cardExpiration: String,
    val pin: String,
)
