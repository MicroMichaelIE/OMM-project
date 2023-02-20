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

export type Template = {
    _id: string
    name: string
    owner: string
    date: Date
    imageLocation: string
    published: boolean
}

export type Meme = {
    _id: string
    givenName: string
    description: string
    owner: {
        id: string
        username: string
    }
    imageLocation: string
    uploadDate: Date
    private: boolean
    draft: boolean
    likes: [
        {
            id: string
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
