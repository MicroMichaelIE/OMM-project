import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'
import { useNavigate, Outlet } from 'react-router-dom'
import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'
import { EntryText } from '../../components/Entry/EntryText/EntryText'
import { FeedMeme } from '../../components/FeedMeme/FeedMeme'
import { FilterSection } from '../../components/filterSection/FilterSection'
import { Icon } from '../../components/Icon/Icon'
import useAuth from '../../hooks/useAuth'
import {
    getMemesBackend,
    makeMemePrivateBackend,
    MemeInteractionBackend,
    MemeInteractionDetails,
} from '../../services/memeService'
import { LoggedInUser, Meme, newComment } from '../../types/types'
import { MemeViewer } from '../MemeViewer/MemeViewer'

import './Feed.scss'


export const Feed = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalMemeIndex, setModalMemeIndex] = useState(0)
    const [isAutoplayed, setIsAutoplayed] = useState<boolean>(false)

    const [stateMemes, setMemes] = useState<Meme[]>([])
    const [user, setUser] = useState<LoggedInUser>({} as LoggedInUser)

    const [queryString, setQueryString] = useState<string>('')

    const { getUser } = useAuth()




    const getMemes = async (paramQueryString: string) => {
        const { memes, message, ok } = await getMemesBackend(paramQueryString)
        console.log(memes)

        if (ok) {
            setMemes(memes)
        } else {
            console.log(message)
        }
    }

    const getUserAsync = async () => {
        const { user } = await getUser()
        if (user) {
            setUser(user)
        }
    }

    useEffect(() => {
        getUserAsync()
    }, [])




    const onLike = async (meme: Meme) => {
        const { ok, message, updatedMeme } = await MemeInteractionBackend({
            memeId: meme._id,
            interactionType: 'like',
        })
        if (ok) {
            const newMemes = [...stateMemes]
            const index = newMemes.findIndex((m) => m._id === meme._id)
            newMemes[index] = updatedMeme
            setMemes(newMemes)
        }
    }

    const onUnlike = async (meme: Meme) => {
        const { ok, message, updatedMeme } = await MemeInteractionBackend({
            memeId: meme._id,
            interactionType: 'unlike',
        })
        if (ok) {
            const newMemes = [...stateMemes]
            const index = newMemes.findIndex((m) => m._id === meme._id)
            newMemes[index] = updatedMeme
            setMemes(newMemes)
        }
    }

    const onComment = async (memeId: string, commentInfo: newComment) => {
        const MemeInteractionDetails: MemeInteractionDetails = {
            memeId: memeId,
            interactionType: 'comment',
            comment: commentInfo,
        }

        const { ok, message, updatedMeme } = await MemeInteractionBackend({
            memeId: memeId,
            interactionType: 'comment',
            comment: commentInfo,
        })
        if (ok) {
            const newMemes = [...stateMemes]
            const index = newMemes.findIndex((m) => m._id === memeId)
            newMemes[index] = updatedMeme
            setMemes(newMemes)
        }
    }

    const onShare = (meme: Meme) => {
        // do something
    }

    // https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object



    /*
    const onLike = (meme: Meme) => {
        const newMemes = [...stateMemes];
        const index = newMemes.findIndex((m) => m.id === meme.id);
        newMemes[index].likes++;
        setMemes(newMemes);
    };
     
    */

    const onMemeClick = (e: React.SyntheticEvent<HTMLElement>, meme: Meme) => {
        e.preventDefault()
        setModalOpen(true)
    }

    const onNext = () => {
        if (modalMemeIndex + 1 === stateMemes.length) {
            setModalMemeIndex(0)
        } else {
            setModalMemeIndex(modalMemeIndex + 1)
        }
    }

    const onPrevious = () => {
        if (modalMemeIndex != 0) {
            setModalMemeIndex(modalMemeIndex - 1)
        } else {
            setModalMemeIndex(stateMemes.length - 1)
        }
    }

    const onRandom = () => {
        const randomIndex = Math.floor(Math.random() * (stateMemes.length - 1))
        setModalMemeIndex(randomIndex)
    }

    const onStartAutoplay = () => {
        setIsAutoplayed(true)
    }

    const onStopAutoplay = () => {
        setIsAutoplayed(false)
    }

    const onAutoplay = () => {
        console.log(modalMemeIndex)
        onNext()
        setTimeout(onAutoplay, 1000)
    }

    // https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react
    // as help 

    const timerRef = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (isAutoplayed) {
            timerRef.current = setInterval(() => {
                setModalMemeIndex((prevIndex) =>
                    prevIndex === stateMemes.length - 1 ? 0 : prevIndex + 1
                )
            }, 1000)
        } else {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [isAutoplayed, modalMemeIndex])

    useEffect(() => {
        if (queryString === "") {
            return
        }
        getMemes(queryString)
    }, [queryString])


    const makeMemePrivate = async (meme: Meme) => {
        const { ok, message, updatedMeme } = await makeMemePrivateBackend(meme._id)

        if (ok) {
            const newMemes = [...stateMemes]
            const index = newMemes.findIndex((m) => m._id === updatedMeme._id)
            newMemes[index] = updatedMeme
            setMemes(newMemes)
        } else {
            console.log(message)
        }
    }



    return (
        <div className="Feed">
            <h1>Feed</h1>
            <FilterSection setQueryString={setQueryString} queryString={queryString} className={"feed-filter"} />
            <div className="AllMemes">
                {stateMemes.map((meme) => (
                    <div key={meme._id} className="Meme">
                        <FeedMeme
                            user={user}
                            meme={meme}
                            onLike={onLike}
                            onUnlike={onUnlike}
                            onComment={onComment}
                            onPrivate={makeMemePrivate}
                            onShare={onShare}
                            onImageClick={onMemeClick}
                        />
                    </div>
                ))}
            </div>
            {stateMemes.length === 0 ? <h2>No memes found</h2> : null}
            {modalOpen ? (
                <MemeViewer
                    user={user}
                    currentImageIndex={modalMemeIndex + 1}
                    totalImages={stateMemes.length - 1}
                    onCommentSubmit={onComment}
                    meme={stateMemes[modalMemeIndex]}
                    onExit={() => setModalOpen(false)}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    onRandom={onRandom}
                    onStartAutoplay={onStartAutoplay}
                    onStopAutoplay={onStopAutoplay}
                    isAutoplayed={isAutoplayed}
                />
            ) : null}
        </div>
    )
}
