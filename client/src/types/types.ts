export type Picture = {
    id?: string
    file?: any
    src: string
    alt: string
    ImagePreviewUrl?: string
}

export type ProfileData = {
    username: string
    user_description: string
}

export type userAuth = {
    username: string
    password: string
}

export type LoggedInUser = {
    id: string
    email: string
    username: string
    token: string
}

export type Meme = {
    id: string
    title: string
    description: string
    image: string
    user_id: string
    username: string
    created_at: string
    updated_at: string
    likes: [
        {
            id: string
            user_id: string
            meme_id: string
        }
    ]
    comments: [
        {
            id: string
            comment: string
            user_id: string
            meme_id: string
            username: string
            created_at: string
            updated_at: string
        }
    ]
}
