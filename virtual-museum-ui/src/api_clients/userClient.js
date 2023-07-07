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
    return {location: location, body: (await response.json()).content}
}

async function getActiveUsersByHour() {
    const response = await fetch(`${SERVER_URL}/${USER_API_ACTIVE_USERS_24H_ENDPOINT}`)
    return (await response.json()).content
}

async function getCurrentlyActiveUsers() {
    const response = await fetch(`${SERVER_URL}/${USER_API_ACTIVE_USERS_NOW_ENDPOINT}`)
    return (await response.json()).content
}

async function getRegisteredUsers() {
    const response = await fetch(`${SERVER_URL}/${USER_API_NON_ADMIN_USERS_ENDPOINT}`)
    return (await response.json()).content
}
async function approveRegistration(userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_APPROVE_USER_ENDPOINT}/${userId}`)
    return (await response.json()).content
}

async function blockUser(userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_BLOCK_USER_ENDPOINT}/${userId}`)
    return (await response.json()).content
}

async function resetUserPassword(userId) {
    const response = await fetch(`${SERVER_URL}/${USER_API_RESET_PASSWORD_USER_ENDPOINT}/${userId}`)
    return (await response.json()).content
}

export default {register, authenticate, getActiveUsersByHour, getCurrentlyActiveUsers, getRegisteredUsers, approveUserRegistration: approveRegistration, blockUser, resetUserPassword}