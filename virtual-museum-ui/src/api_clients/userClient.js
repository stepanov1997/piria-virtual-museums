import {
    SERVER_URL,
    USER_API_POST_LOGIN_ENDPOINT,
    USER_API_POST_REGISTER_ENDPOINT
} from '../../config.json'

async function authenticate(username, password) {
    const response = await fetch(`${SERVER_URL}/${USER_API_POST_LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        redirect: 'follow'
    })
    return await response.json()
}

async function register(firstname, lastname, username, password, email) {
    const response = await fetch(`${SERVER_URL}/${USER_API_POST_REGISTER_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
            'firstName': firstname,
            'lastName': lastname,
            'username': username,
            'password': password,
            'email': email
        }),
        redirect: 'follow'
    })
    const location = response.headers["Location"]
    return {location: location, body: await response.json()}
}

export default {register, authenticate}