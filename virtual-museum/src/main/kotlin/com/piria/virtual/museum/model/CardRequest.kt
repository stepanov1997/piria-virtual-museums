package com.piria.virtual.museum.model

import com.piria.virtual.museum.model.bank.CardType
import com.piria.virtual.museum.model.bank.PaymentAuthorizationRequest
import com.piria.virtual.museum.model.bank.PaymentRequest

data class TicketRequest(
    val cardHolderFirstName: String,
    val cardHolderSurname: String,
    val cardNumber: String,
    val cardType: CardType,
    val cardExpiration: String,
    val pin: String,
    val receiverCardNumber: String,
    val amount: Double
) {
    fun createRequests() : Pair<PaymentAuthorizationRequest, PaymentRequest> = Pair(
        PaymentAuthorizationRequest(
            cardHolderFirstName=cardHolderFirstName,
            cardHolderSurname=cardHolderSurname,
            cardNumber=cardNumber,
            cardType=cardType,
            cardExpiration=cardExpiration,
            pin=pin
        ),
        PaymentRequest(
            receiverCardNumber=receiverCardNumber,
            amount=amount
        )
    )
}
