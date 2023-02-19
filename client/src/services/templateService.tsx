import { URL } from './urlService'

import { useLocalStorage } from '../hooks/useLocalStorage'

const { getItem } = useLocalStorage()


export const getTemplatesBackend = async () => {

    const userToken = getItem('token')

    const response = await fetch(`${URL}/templates/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true, templates: json.templates }
    } else {
        return { ok: false, message: json.message }
    }
}

export const uploadTemplateBackend = async (
    templateDetails: FormData
) => {

    const userToken = getItem('token')
    console.log(userToken)
    const response = await fetch(`${URL}/templates/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
        body: templateDetails,
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true }
    } else {
        return { ok: false, message: json.message }
    }
}
