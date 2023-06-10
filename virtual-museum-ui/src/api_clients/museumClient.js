import {SERVER_URL,
        MUSEUM_API_GET_ALL_ENDPOINT,
        MUSEUM_API_GET_ALL_BY_NAME_ENDPOINT,
        MUSEUM_API_GET_ALL_BY_CITY_ENDPOINT} from '../../config.json'

async function getAllMuseums(jwt) {
    const response = await fetch(`${SERVER_URL}/${MUSEUM_API_GET_ALL_ENDPOINT}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function getAllMuseumsByName(jwt, name) {
    const response = await fetch(`${SERVER_URL}/${MUSEUM_API_GET_ALL_BY_NAME_ENDPOINT}/${name}`, {
        headers: { 'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function getAllMuseumsByCity(jwt, city) {
    const response = await fetch(`${SERVER_URL}/${MUSEUM_API_GET_ALL_BY_CITY_ENDPOINT}/${city}`, {
        headers: { 'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

export default {getAllMuseums, getAllMuseumsByName, getAllMuseumsByCity}