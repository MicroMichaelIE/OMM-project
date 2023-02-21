import { Modal, Button } from "react-bootstrap";
import { CommentSection } from "../../components/FeedMeme/FeedMemeComments/CommentSection";
import { Icon } from "../../components/Icon/Icon";
import { templateURL } from "../../services/urlService";
import { Meme, newComment } from "../../types/types";

import "./MemeViewer.scss";

interface MemeViewerProps {
    currentImageIndex: number;
    totalImages: number;
    meme: Meme;
    onNext: () => void;
    onPrevious: () => void;
    onExit: () => void;
    onCommentSubmit: (memeId: string, comment: newComment) => void;
}

export const MemeViewer = (
    {
        currentImageIndex,
        totalImages,
        meme,
        onNext,
        onPrevious,
        onExit,
        onCommentSubmit,
    }: MemeViewerProps
) => {

    const handleNext = () => {
        onNext();
    };

    const handlePrevious = () => {
        onPrevious();
    };

    const handleExit = () => {
        onExit();
    };


    return (
        <Modal show={true} onHide={handleExit} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>{meme.givenName} {currentImageIndex}/{totalImages}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="MemeViewer">
                    <div className="MemeViewer_Image">
                        <img src={`${templateURL}/${meme.imageLocation}`} alt="meme" />

                        <div className="MemeViewer_Navigation">
                            <button onClick={handlePrevious}>
                                <Icon name="chevron_left" />
                            </button>
                            <button onClick={handleNext}>
                                <Icon name="chevron_right" />
                            </button>
                        </div>
                    </div>
                    <div className="MemeDetails">
                        <div className="UserInfo">
                            {meme.owner.username}
                        </div>
                        <div className="MemeInfo">
                            {meme.description}
                        </div>
                        <CommentSection previewCommentsNumber={meme.comments.length} memeId={meme._id} onCommentSubmit={onCommentSubmit} memeComments={meme.comments} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    );
};