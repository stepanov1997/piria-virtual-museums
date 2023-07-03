import {SERVER_URL,
    VIRTUAL_VISIT_API_GET_BY_MUSEUM_ID_ENDPOINT,
    MUSEUM_API_GET_ALL_BY_CITY_ENDPOINT} from '../../config.json'

export async function getAllByMuseumId(jwt, museumId) {
    const response = await fetch(`${SERVER_URL}/${VIRTUAL_VISIT_API_GET_BY_MUSEUM_ID_ENDPOINT}/${museumId}`, {
        headers: { 'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}