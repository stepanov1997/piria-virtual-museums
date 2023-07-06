import {SERVER_URL,
    BATTUTA_API_GET_CITIES} from '../../config.json'

async function getAllCities(countryCode) {
    const response = await fetch(`${SERVER_URL}/${BATTUTA_API_GET_CITIES}/${countryCode}`, {
        mode: 'cors'
    })
    return await response.json()
}

export default {getAllCities}