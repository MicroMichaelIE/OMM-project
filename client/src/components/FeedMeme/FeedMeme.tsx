import { BlankCard } from '../BlankCard/BlankCard'
import { Icon } from '../Icon/Icon'
import { LoggedInUser, Meme, newComment } from '../../types/types'
import { templateURL } from '../../services/urlService'
import useAuth from '../../hooks/useAuth'
import './FeedMeme.scss'
import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { CommentSection } from './FeedMemeComments/CommentSection'

interface FeedMemeProps {
    meme: Meme
    user: LoggedInUser
    onLike: (meme: Meme) => void
    onUnlike: (meme: Meme) => void
    onComment: (memeId: string, comment: newComment) => void
    onShare: (meme: Meme) => void
    onImageClick: (e: React.SyntheticEvent<HTMLElement>, meme: Meme) => void
}

export const FeedMeme = ({
    meme,
    user, 
    onLike,
    onUnlike,
    onComment,
    onShare,
    onImageClick,
}: FeedMemeProps): JSX.Element => {
    const [stateHasLiked, setStateHasLiked] = useState<boolean>(false)


    useEffect(() => {
        hasLiked(meme)
    }, [meme])


    const toDateToString = (date: string): string => {
        const dateObj = new Date(date)
        return dateObj.toLocaleDateString(

        )
    }

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

    return (
        <BlankCard>
            <div className="Top">
                <div className="Top_Image" onClick={(e) => onImageClick(e, meme)}>
                    <img src={`${templateURL}/${meme.imageLocation}`} alt="meme" />
                </div>

            </div>
            <div className="Bottom">
                <div className="BottomContent">
                    <p>{meme.owner.username}</p>
                    <p>{toDateToString(meme.uploadDate)}</p>

                </div>
                <div className="description">
                    <p>{meme.description}</p>
                </div>
                <div className="interactions">
                    <div className="like">
                        {!stateHasLiked ? (<button onClick={() => onLike(meme)}>
                            <Icon name="thumb_up" />
                        </button>)
                            : (<button onClick={() => onUnlike(meme)}>
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
                        <button onClick={() => onShare(meme)}>
                            <Icon name="share" />
                        </button>

                    </div>
                </div>
                <CommentSection memeId={meme._id} onCommentSubmit={onComment} memeComments={meme.comments} />
            </div>
        </BlankCard >
    )
}
