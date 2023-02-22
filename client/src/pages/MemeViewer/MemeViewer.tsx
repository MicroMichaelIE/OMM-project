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
    isAutoplayed: boolean;
    onNext: () => void;
    onPrevious: () => void;
    onExit: () => void;
    onRandom: () => void;
    onCommentSubmit: (memeId: string, comment: newComment) => void;
    onStartAutoplay: () => void;
    onStopAutoplay: () => void;
}

export const MemeViewer = (
    {
        currentImageIndex,
        totalImages,
        meme,
        isAutoplayed,
        onNext,
        onPrevious,
        onExit,
        onRandom,
        onCommentSubmit,
        onStartAutoplay,
        onStopAutoplay,
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

    const onRandomMeme = () => {
        onRandom()
    };


    return (
        <Modal show={true} onHide={handleExit} size="xl" centered>
            <Modal.Header closeButton className="split">
                <Modal.Title>{meme.givenName} {currentImageIndex}/{totalImages}</Modal.Title>
                <div className="myButtons">
                    <Button onClick={onRandomMeme}>Random Meme</Button>
                    {isAutoplayed ? <Button onClick={onStopAutoplay}>Stop Autoplay</Button> : <Button onClick={onStartAutoplay}>Start Autoplay</Button>}
                </div>
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