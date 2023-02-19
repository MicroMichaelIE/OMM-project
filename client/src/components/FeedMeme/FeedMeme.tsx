import { BlankCard } from '../BlankCard/BlankCard'
import { Icon } from '../Icon/Icon'
import { Meme } from '../../types/types'

interface FeedMemeProps {
    meme: Meme
    onLike: (meme: Meme) => void
    onDislike: (meme: Meme) => void
    onComment: (meme: Meme) => void
    onShare: (meme: Meme) => void
}

export const FeedMeme = ({
    meme,
    onLike,
    onDislike,
    onComment,
    onShare,
}: FeedMemeProps): JSX.Element => {
    return (
        <BlankCard>
            <div className="Top_Image">
                <img src={meme.image} alt="meme" />
            </div>
            <div className="Bottom">
                <div className="interactions">
                    <div className="like">
                        <button onClick={() => onLike(meme)}>
                            <Icon name="thumb_up" />
                        </button>
                        <p>{meme.likes.length}</p>
                    </div>
                    <div className="comment">
                        <button onClick={() => onComment(meme)}>
                            <Icon name="comment" />
                        </button>
                        <p>{meme.comments.length}</p>
                    </div>
                    <div className="share">
                        <button onClick={() => onShare(meme)}>
                            <Icon name="share" />
                        </button>
                    </div>
                </div>
                <div className="description">
                    <p>{meme.description}</p>
                </div>
            </div>
        </BlankCard>
    )
}
