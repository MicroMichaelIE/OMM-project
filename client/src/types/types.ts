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
    _id: string
    username: string
}

export interface Template {
    _id: string
    givenName: string
    name: string
    owner: string
    date: Date
    imageLocation: string
    longerDescription?: string
    published: boolean
}

export type Meme = {
    _id: string
    givenName: string
    description: string
    owner: {
        _id: string
        username: string
    }
    imageLocation: string
    longerDescription?: string
    uploadDate: string
    private: boolean
    draft: boolean
    likes: string[]
    comments: [
        {
            id: string
            owner: {
                id: string
                username: string
            }
            postedDate: string
            text: string
        }
    ]
}

export type newComment = {
    text: string
}

export interface oldComment extends newComment {
    id: string
    owner: {
        id: string
        username: string
    }
    postedDate: string
    text: string
}
