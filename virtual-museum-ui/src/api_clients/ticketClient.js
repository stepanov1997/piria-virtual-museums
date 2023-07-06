import {
    SERVER_URL,
    TICKET_API_POST_ENDPOINT
} from '../../config.json'

export async function buyTicket(jwt, virtualVisitId, cardHolderFirstName, cardHolderSurname, cardNumber, cardType, cardExpiration, pin, receiverCardNumber, amount) {
    const response = await fetch(`${SERVER_URL}/${TICKET_API_POST_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            virtualVisitId: virtualVisitId,
            paymentRequiredInfo: {
                cardHolderFirstName,
                cardHolderSurname,
                cardNumber,
                cardType,
                cardExpiration,
                pin,
                receiverCardNumber,
                amount
            }
        }),
        redirect: 'follow'
    })
    return await response.json()
}
