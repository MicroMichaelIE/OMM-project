import { BlankCard } from '../BlankCard/BlankCard'
import { Icon } from '../Icon/Icon'
import { LoggedInUser, Meme, newComment } from '../../types/types'
import { templateURL } from '../../services/urlService'
import useAuth from '../../hooks/useAuth'
import './FeedMeme.scss'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CommentSection } from './FeedMemeComments/CommentSection'
import { makeMemePrivateBackend } from '../../services/memeService'

interface FeedMemeProps {
    meme: Meme
    user: LoggedInUser
    onLike?: (meme: Meme) => void
    onUnlike?: (meme: Meme) => void
    onPrivate?: (meme: Meme) => void
    onComment?: (memeId: string, comment: newComment) => void
    onShare?: (meme: Meme) => void
    onImageClick?: (e: React.SyntheticEvent<HTMLElement>, meme: Meme) => void
}

export const FeedMeme = ({
    meme,
    user,
    onLike,
    onUnlike,
    onComment,
    onPrivate,
    onShare,
    onImageClick,
}: FeedMemeProps): JSX.Element => {
    const [stateHasLiked, setStateHasLiked] = useState<boolean>(false)
    const [stateIsOwner, setStateIsOwner] = useState<boolean>(false)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)


    useEffect(() => {
        hasLiked(meme)
        if(meme.private){
            setIsPrivate(true)
        }
    }, [meme])

    useEffect(() => {
        console.log(user._id, meme.owner._id)
        if (user._id == meme.owner._id) {
            setStateIsOwner(true)
        }
    }, [user])

    const toDateToString = (date: string): string => {
        const dateObj = new Date(date)
        return dateObj.toLocaleDateString(

        )
    }

    console.log(meme.owner._id)


    const hasLiked = async (meme: Meme) => {
        if (user && user._id) {
            const Id = user._id
            // console.log(meme.likes.some(el => { console.log(el._id); el._id === user._id }))
            // meme.likes.some(el => el._id === user._id) ? setStateHasLiked(true) : setStateHasLiked(false)
            meme.likes.includes(Id) ? setStateHasLiked(true) : setStateHasLiked(false)
        } else {
            setStateHasLiked(false)
        }
    }

    const handleFunctions = (meme: Meme, func: any) => {
        if (func) {
            func(meme)
        } else {
            console.log('function not passed')
        }
    }

    const handleOnComment = (memeId: string, comment: newComment) => {
        if (onComment) {
            onComment(memeId, comment)
        } else {
            console.log('function not passed')
        }
    }

    const handleImageClick = (e: React.SyntheticEvent<HTMLElement>, meme: Meme) => {
        if (onImageClick) {
            onImageClick(e, meme)
        } else {
            console.log('function not passed')
        }
    }

    console.log(meme.owner._id === user._id)
    return (
        <BlankCard>
            <div className="Top">
                <div className="Top_Image" onClick={(e) => handleImageClick(e, meme)}>
                    <img src={`${templateURL}/${meme.imageLocation}`} alt="meme" aria-description={meme.longerDescription} />
                </div>

            </div>
            <div className="Bottom">
                <div className="BottomContent">
                    <p>{meme.owner.username}</p>
                    <p>{toDateToString(meme.uploadDate)}</p>
                    {stateIsOwner && (
                        <Button variant="secondary" size="sm" className="makePrivate" onClick={() => handleFunctions(meme, onPrivate)}>
                            {isPrivate ? 'Make Public' : 'Make Private'}
                        </Button>)}

                </div>
                <div className="description">
                    <p>{meme.description}</p>
                </div>
                <div className="interactions">
                    <div className="like">
                        {!stateHasLiked ? (<button onClick={() => handleFunctions(meme, onLike)}>
                            <Icon name="thumb_up" />
                        </button>)
                            : (<button onClick={() => handleFunctions(meme, onUnlike)}>
                                <Icon name="thumb_down" />
                            </button>)
                        }
                        <p>{meme.likes.length}</p>
                    </div>
                    <div className="comment">
                        <Icon name="comment" />
                        <p>{meme.comments.length}</p>
                    </div>
                    <div className="share">
                        <button onClick={() => handleFunctions(meme, onShare)}>
                            <Icon name="share" />
                        </button>

                    </div>
                </div>

                <CommentSection canComment={user._id ? true : false} memeId={meme._id} onCommentSubmit={handleOnComment} memeComments={meme.comments} />
            </div>
        </BlankCard >
    )
}
