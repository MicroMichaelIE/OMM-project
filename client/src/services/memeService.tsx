import { newComment, oldComment } from '../types/types'
import { URL } from './urlService'

export const getMemesBackend = async (query?: string) => {
    const url = query ? `${URL}/memes${query}` : `${URL}/memes`
    const response = await fetch(url, {
        method: 'GET',
    })
    const json = await response.json()

    if (response.ok) {
        if (json.memes.length === 0) {
            return { ok: true, memes: [] }
        } else {
            return { ok: true, memes: json.memes }
        }
    } else {
        return { ok: false, message: json.message }
    }
}

export const getMemeByIdBackend = async (memeId: string) => {
    const response = await fetch(`${URL}/memes/${memeId}`, {
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
    interactionType: 'like' | 'unlike' | 'comment'
    comment?: newComment | oldComment
}

export const MemeInteractionBackend = async (
    memeDetails: MemeInteractionDetails
) => {
    const token = localStorage.getItem('token')
    console.log(memeDetails)
    const response = await fetch(
        `${URL}/memes/${memeDetails.memeId}/${memeDetails.interactionType}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(memeDetails.comment)
        }
    )
    const json = await response.json()

    if (response.ok && !json.message) {
        return { ok: true, updatedMeme: json.updatedMeme }
    } else {
        return { ok: false, message: json.message }
    }
}



//Images imported from https://imgflip.com/api
export const getAPIMemes = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    return await response.json();
};

// export const DeleteMemeCommentBackend = async (
//     memeDetails: MemeInteractionDetails,
//     token: string
// ) => {

//     const response = await fetch(
//         `${URL}/meme/${memeDetails.memeId}/comment/${memeDetails.comment!._id!}/delete`,
//         {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         }
//     )

//     const json = await response.json()

//     if (response.ok) {
//         return { ok: true, message: json.message }
//     } else {
//         return { ok: false, message: json.message }
//     }
// }


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
