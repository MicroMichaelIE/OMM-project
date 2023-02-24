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
    image: Buffer
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
    ];
    templateId: string; // new property
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

export type Textbox = {
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    font: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    [key: string]: any; // This is the index signature
}