import {
    SERVER_URL,
    USER_API_POST_LOGIN_ENDPOINT,
    USER_API_POST_REGISTER_ENDPOINT,
    USER_API_ACTIVE_USERS_24H_ENDPOINT,
    USER_API_ACTIVE_USERS_NOW_ENDPOINT,
    USER_API_NON_ADMIN_USERS_ENDPOINT,
    USER_API_APPROVE_USER_ENDPOINT,
    USER_API_BLOCK_USER_ENDPOINT,
    USER_API_RESET_PASSWORD_USER_ENDPOINT,
    USER_API_POST_LANG_ENDPOINT,
    USER_API_GET_LANG_ENDPOINT
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
    return await response.json()
}

async function getActiveUsersByHour(jwt) {
    const response = await fetch(`${SERVER_URL}/${USER_API_ACTIVE_USERS_24H_ENDPOINT}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function getCurrentlyActiveUsers(jwt) {
    const response = await fetch(`${SERVER_URL}/${USER_API_ACTIVE_USERS_NOW_ENDPOINT}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function getRegisteredUsers(jwt) {
    const response = await fetch(`${SERVER_URL}/${USER_API_NON_ADMIN_USERS_ENDPOINT}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}
async function getUserLanguage(jwt) {
    const response = await fetch(`${SERVER_URL}/${USER_API_GET_LANG_ENDPOINT}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}
async function setUserLanguage(jwt, lang) {
    const response = await fetch(`${SERVER_URL}/${USER_API_POST_LANG_ENDPOINT}/${lang}`,{
        method: 'POST',
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}


async function approveRegistration(jwt, userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_APPROVE_USER_ENDPOINT}/${userId}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function blockUser(jwt, userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_BLOCK_USER_ENDPOINT}/${userId}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

async function resetUserPassword(jwt, userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_RESET_PASSWORD_USER_ENDPOINT}/${userId}`, {
        headers: {'Authorization': `Bearer ${jwt}`},
        mode: 'cors'
    })
    return await response.json()
}

export default {register, authenticate, getActiveUsersByHour, getCurrentlyActiveUsers, getRegisteredUsers, approveRegistration, blockUser, resetUserPassword, getUserLanguage, setUserLanguage}