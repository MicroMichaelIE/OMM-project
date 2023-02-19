import { URL } from './urlService'

export const getMemesBackend = async () => {
    const response = await fetch(`${URL}/meme/`, {
        method: 'GET',
    })
    const json = await response.json()

    if (response.ok) {
        return { ok: true, memes: json.memes }
    } else {
        return { ok: false, message: json.message }
    }
}

interface MemeInteractionDetails {
    memeId: string
    userId: string
    interactionType: 'like' | 'unlike' | 'comment'
    commentId?: string
}

export const MemeInteractionBackend = async (
    memeDetails: MemeInteractionDetails,
    token: string
) => {
    const response = await fetch(
        `${URL}/meme/${memeDetails.memeId}/${memeDetails.interactionType}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(memeDetails),
        }
    )
    return response
}



//Images imported from https://imgflip.com/api
export const getAPIMemes = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    return await response.json();
};

export const DeleteMemeCommentBackend = async (
    memeDetails: MemeInteractionDetails,
    token: string
) => {
    const response = await fetch(
        `${URL}/meme/${memeDetails.memeId}/comment/${memeDetails.commentId}/delete`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    const json = await response.json()

    if (response.ok) {
        return { ok: true, message: json.message }
    } else {
        return { ok: false, message: json.message }
    }
}


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
