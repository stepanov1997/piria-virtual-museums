import {SERVER_URL,
    VIRTUAL_VISIT_API_GET_BY_MUSEUM_ID_ENDPOINT,
    VIRTUAL_VISIT_API_ADD_ENDPOINT} from '../../config.json'

export async function getAllByMuseumId(jwt, museumId) {
    const response = await fetch(`${SERVER_URL}/${VIRTUAL_VISIT_API_GET_BY_MUSEUM_ID_ENDPOINT}/${museumId}`, {
        headers: { 'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

export async function addVirtualVisit(jwt, museumId, datetime, duration, price) {
    const response = await fetch(`${SERVER_URL}/${VIRTUAL_VISIT_API_ADD_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        mode: 'cors',
        body: JSON.stringify({
            museumId,
            datetime,
            duration,
            price
        })
    })
    return await response.json()
}