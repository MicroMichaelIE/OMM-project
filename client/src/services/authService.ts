import { userAuth } from '../types/types'
import { LoggedInUser } from '../types/types'
import { URL } from './urlService'

export const loginBackend = async ({ username, password }: userAuth) => {
    const response = await fetch(`${URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    const json = await response.json()
    if (response.ok) {
        return {
            token: json.token,
            ok: true,
        }
    } else {
        return { ok: false, message: json.message }
    }
}

export const signUpBackend = async ({ username, password }: userAuth) => {
    console.log(username, password)
    const response = await fetch(`${URL}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true, token: json.token }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}
export const changePasswordBackend = async (
    username: string,
    password: string,
    oldpassword: string,
    token: string
) => {
    const response = await fetch(`${URL}/users/changepassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, oldpassword }),
    })

    const json = await response.json()

    console.log('json: ', json)

    if (response.ok) {
        return { ok: response.ok, newToken: json.token }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const verifyTokenBackend = async (token: string) => {
    const response = await fetch(`${URL}/users/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const json = await response.json()

    if (response.ok) {
        return { ok: true, messsage: json.message }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

// to like a post etc
const doSomethingBackend = async (token: string) => {
    fetch(`${URL}/users/dosomething`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
}

export const getUserInfoBackend = async (token: string) => {
    const response = await fetch(`${URL}/users/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const json = await response.json()

    if (response.ok) {
        return { ok: true, userInfo: json.user }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}
