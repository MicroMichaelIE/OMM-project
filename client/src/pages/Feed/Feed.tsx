import { useState, useMemo } from 'react'
import { FeedMeme } from '../../components/FeedMeme/FeedMeme'
import {
    getMemesBackend,
    MemeInteractionBackend,
} from '../../services/memeService'
import { Meme } from '../../types/types'

export const Feed = () => {
    const [memes, setMemes] = useState<Meme[]>([])

    const getMemes = async () => {
        const { memes, message, ok } = await getMemesBackend()

        if (ok) {
            setMemes(memes)
        } else {
            console.log(message)
        }
    }

    useMemo(() => {
        getMemes()
    }, [])

    const onLike = (meme: Meme) => {
        // do something
    }

    const onDislike = (meme: Meme) => {
        // do something
    }

    const onComment = (meme: Meme) => {
        // do something
    }

    const onShare = (meme: Meme) => {
        // do something
    }

    /*
    const onLike = (meme: Meme) => {
        const newMemes = [...memes];
        const index = newMemes.findIndex((m) => m.id === meme.id);
        newMemes[index].likes++;
        setMemes(newMemes);
    };

    const onDislike = (meme: Meme) => {
        const newMemes = [...memes];
        const index = newMemes.findIndex((m) => m.id === meme.id);
        newMemes[index].dislikes++;
        setMemes(newMemes);
    };
    */

    return (
        <div className="Feed">
            <h1>Feed</h1>
            <div>
                {memes.map((meme) => (
                    <FeedMeme
                        key={meme.id}
                        meme={meme}
                        onLike={onLike}
                        onDislike={onDislike}
                        onComment={onComment}
                        onShare={onShare}
                    />
                ))}
            </div>
        </div>
    )
}
