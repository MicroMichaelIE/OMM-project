import { Meme } from '../../../../types/types'
import './ViewComment.scss'

interface ViewCommentProps {
    comment: Meme['comments'][0]
}

export const ViewComment = ({ comment }: ViewCommentProps) => {

    // From MMT member
    function truncate(str: string, n: number, useWordBoundary: string) {
        if (str.length <= n) {
            return str;
        }
        const subString = str.slice(0, n - 1); // the original check
        return (useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString) + '....';
    }


    return (
        <div className="ViewComment">
            <div className='usernameDiv'>
                <p className="username">{comment.owner.username}</p>
            </div>
            <div className="text">
                <p>{truncate(comment.text, 100, " Read More ...")}</p>
            </div>
        </div>
    )
}
