import { URL } from './urlService'

export const getTemplatesBackend = async () => {
    const response = await fetch(`${URL}/template/`, {
        method: 'GET',
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true, templates: json.templates }
    } else {
        return { ok: false, message: json.message }
    }
}

export const uploadTemplateBackend = async (
    templateDetails: FormData,
    token: string
) => {
    console.log(templateDetails)

    for (let [key, value] of templateDetails.entries()) {
        console.log(key, value)
    }

    const response = await fetch(`${URL}/templates/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
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
