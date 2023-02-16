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
    email: string
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
    likes: number
    dislikes: number
    comments: number
}
