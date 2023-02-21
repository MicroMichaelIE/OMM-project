import { useState, useMemo, useEffect } from 'react'
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'
import { useNavigate, Outlet } from 'react-router-dom'
import EntryDropdown from '../../components/Entry/EntryDropdown/EntryDropdown'
import { EntryText } from '../../components/Entry/EntryText/EntryText'
import { FeedMeme } from '../../components/FeedMeme/FeedMeme'
import { Icon } from '../../components/Icon/Icon'
import useAuth from '../../hooks/useAuth'
import {
    getMemesBackend,
    MemeInteractionBackend,
} from '../../services/memeService'
import { LoggedInUser, Meme, newComment } from '../../types/types'
import { MemeViewer } from '../MemeViewer/MemeViewer'

import './Feed.scss'

interface queryOptions {
    sort?: string
    limit?: number
    name?: string
    url?: string
    id?: string
    fileformat?: string
}

export const Feed = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalMemeIndex, setModalMemeIndex] = useState(0)

    const [stateMemes, setMemes] = useState<Meme[]>([])
    const [queryString, setQueryString] = useState<string>('')
    const [sortSelected, setSortSelected] = useState<string>('Newest')
    const [limitSelected, setLimitSelected] = useState<string>('10')
    const [fileFormatSelected, setFileFormatSelected] = useState<string>('PNG')
    const [nameFilter, setNameFilter] = useState<string>('')
    const [filterReset, setFilterReset] = useState<boolean>(false)
    const [query, setQuery] = useState<queryOptions>({
        sort: 'desc',
        limit: 10,
    })
    const [user, setUser] = useState<LoggedInUser>({} as LoggedInUser)
    const navigate = useNavigate()

    const { getUser } = useAuth()

    const sortFilters = [
        { value: 'desc', display: 'Newest' },
        { value: 'asc', display: 'Oldest' },
    ]

    const limitFilters = [
        { value: 5, display: '5' },
        { value: 10, display: '10' },
        { value: 20, display: '20' },
    ]

    const fileFormatFilters = [
        { value: 'png', display: 'PNG' },
        { value: 'jpg', display: 'JPG' },
        { value: 'jpeg', display: 'JPEG' },
        { value: 'gif', display: 'GIF' },
    ]

    const getMemes = async () => {
        const { user } = await getUser()
        const { memes, message, ok } = await getMemesBackend(queryString)
        console.log(memes)

        if (ok) {
            setMemes(memes)
        } else {
            console.log(message)
        }
        if (user) {
            setUser(user)
        }
    }

    useEffect(() => {
        formatQuery()
        // dont use name filter here so we can make less calls to the backend
    }, [sortSelected, limitSelected, fileFormatSelected])

    useEffect(() => {
        getMemes()
        console.log(queryString)
    }, [queryString])

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

    const formatQuery = () => {
        console.log(query)
        let array = []
        let params
        for (const p in query)
            if (query.hasOwnProperty(p)) {
                // @ts-ignore
                array.push(
                    encodeURIComponent(p) +
                    '=' +
                    // @ts-ignore
                    encodeURIComponent(query[p as keyof queryOptions])
                )
            }
        params = `?${array.join('&')}`
        setQueryString(params)
    }

    const handleFilterDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setSortSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleLimitDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setLimitSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleFileFormatDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setFileFormatSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(e.target.value)
        setQuery({
            ...query,
            name: e.target.value,
        })
    }

    const handleResetFilters = () => {
        setSortSelected('Newest')
        setLimitSelected('10')
        setFileFormatSelected('')
        setNameFilter('')
        setQuery({
            sort: 'desc',
            limit: 10,
        })
        setFilterReset(false)
    }

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

    const onModalClose = () => {
        setModalOpen(false)
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

    return (
        <div className="Feed">
            <h1>Feed</h1>
            <div className="filterSection">
                <div className="nameFilter">
                    <EntryText
                        id="name"
                        label="Name"
                        name="name"
                        type="text"
                        value={nameFilter}
                        onChange={handleTextInputChange}
                    />
                    <Button onClick={() => formatQuery()}>Search</Button>
                </div>
                <div className="filters">
                    <div className="sortFilter">
                        <EntryDropdown
                            id="sort"
                            objectKey="sort"
                            label="Sort"
                            options={sortFilters}
                            setSelected={handleFilterDropdownChange}
                            selected={sortSelected}
                        />
                    </div>
                    <div className="limitFilter">
                        <EntryDropdown
                            id="limit"
                            objectKey="limit"
                            label="Limit"
                            options={limitFilters}
                            setSelected={handleLimitDropdownChange}
                            selected={limitSelected}
                        />
                    </div>
                    <div className="fileFormatFilters">
                        <EntryDropdown
                            id="fileFormat"
                            objectKey="fileformat"
                            label="File Format"
                            options={fileFormatFilters}
                            setSelected={handleFileFormatDropdownChange}
                            selected={fileFormatSelected}
                        />
                    </div>
                    {filterReset ? (
                        <button
                            className="filterReset"
                            onClick={() => handleResetFilters()}
                        >
                            <Icon name="filter_alt_off" />{' '}
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="AllMemes">
                {stateMemes.map((meme) => (
                    <div key={meme._id} className="Meme">
                        <FeedMeme
                            user={user}
                            meme={meme}
                            onLike={onLike}
                            onUnlike={onUnlike}
                            onComment={onComment}
                            onShare={onShare}
                            onImageClick={onMemeClick}
                        />
                    </div>
                ))}
            </div>
            {stateMemes.length === 0 ? <h2>No memes found</h2> : null}
            {modalOpen ? (
                <MemeViewer
                    currentImageIndex={modalMemeIndex + 1}
                    totalImages={stateMemes.length - 1}
                    onCommentSubmit={onComment}
                    meme={stateMemes[modalMemeIndex]}
                    onExit={() => setModalOpen(false)}
                    onNext={onNext}
                    onPrevious={onPrevious}
                />
            ) : null}
        </div>
    )
}
