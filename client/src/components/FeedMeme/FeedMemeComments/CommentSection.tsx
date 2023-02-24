import { useState } from "react";
import { Meme, newComment } from "../../../types/types";

import { Button, Form } from 'react-bootstrap'

import './CommentSection.scss';
import { ViewComment } from "./ViewComment/ViewComment";

interface CommentSectionProps {
    memeId: string;
    canComment: boolean;
    memeComments: Meme['comments']
    onCommentSubmit: (memeId: string, newComment: newComment) => void
    previewCommentsNumber?: number
}

export const CommentSection = ({
    canComment,
    memeId,
    memeComments,
    onCommentSubmit,
    previewCommentsNumber = 3
}: CommentSectionProps) => {

    const [comment, setComment] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const commentInfo: newComment = {
            text: comment
        }
        setComment('')

        console.log(e)
        onCommentSubmit(memeId, commentInfo)
    }

    return (
        <div className="CommentSection">
            <div className={previewCommentsNumber > 3 ? "scrollComments" : 'comments'}>
                {memeComments.length > 0 ? memeComments.slice(0, previewCommentsNumber).map((comment, index) =>

                    <ViewComment key={comment.id} comment={comment} />


                ) : <p className="noComments">No comments yet</p>}
                <div>
                </div>
                {/* {memeComments.length > previewCommentsNumber ? <p>View all {memeComments.length} comments</p> : null} */}
            </div>
            {canComment &&
                <Form className='CommentForm' onSubmit={handleSubmit}>
                    <Form.Group controlId="commentForm.TextArea">
                        <Form.Control as="textarea" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Comment
                    </Button>
                </Form>}
        </div >
    )
}