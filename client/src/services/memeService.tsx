import { URL } from './urlService'

interface MemeInteractionDetails {
    memeId: string
    userId: string
    interactionType: 'like' | 'dislike' | 'comment' | 'share'
}

export const MemeInteractionBackend = async (
    memeDetails: MemeInteractionDetails,
    token: string
) => {
    const response = await fetch('/api/memeinteraction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memeDetails),
    })
    return response
}


//Images imported from https://imgflip.com/api
export const getAPIMemes = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    return await response.json();
};

export const uploadImagesBackend = async (
    formData: FormData,
    token: string
) => {
    const response = await fetch(`${URL}/meme/template`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true }
    } else {
        return { ok: false }
    }
}