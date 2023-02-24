import { useCallback, useEffect, useMemo, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { FeedMeme } from '../../components/FeedMeme/FeedMeme'
import useAuth from '../../hooks/useAuth'
import { getMemesBackend, getMemesByUserBackend } from '../../services/memeService'
import { LoggedInUser, Meme } from '../../types/types'

import './Profile.scss'

export const Profile = () => {
    const { getUser } = useAuth()

    const [user, setUser] = useState<LoggedInUser>()
    const [userMemes, setUserMemes] = useState<Meme[]>([])

    const getUserData = useCallback(async () => {
        const { user, ok } = await getUser()
        if (ok) {
            setUser(user)
        }
    }, [getUser])

    const getUserMemes = useCallback(async () => {
        if (user?._id) {
            const { memes, ok } = await getMemesByUserBackend(user?._id)
            if (ok) {
                setUserMemes(memes)
            } else {
                setUserMemes([])
            }
        }
    }, [user?._id])

    useMemo(() => {
        getUserData()
    }, [])

    // get User posted Memes
    useMemo(() => {
        getUserMemes()
    }, [user])


    return (
        <div className="Profile">
            <Tabs defaultActiveKey={"posted_memes"}
                id="TabSwitcher"
                className='mb-3'>
                <Tab eventKey="posted_memes" title="My Posted Memes" className='Tab'>
                    <div className="AllMemes">
                        {userMemes.filter(meme => meme.private === false).map((meme) => (
                            <div className="Meme" key={meme._id}>
                                <FeedMeme user={user!} meme={meme} />
                            </div>))}

                    </div>
                </Tab>
                <Tab eventKey="draft_memes" title="My Draft Memes" className='Tab'>
                    <div className="AllMemes">
                        {userMemes.filter(meme => meme.draft === true).map((meme) => (
                            <div className="Meme" key={meme._id}>
                                <FeedMeme user={user!} meme={meme} />
                            </div>))}

                    </div>
                </Tab>
                <Tab eventKey="private_memes" title="My Private Memes" className='Tab'>
                    <div className="AllMemes">
                        {userMemes.filter(meme => meme.private === true).map((meme) => (
                            <div className="Meme" key={meme._id}>
                                <FeedMeme user={user!} meme={meme} />
                            </div>))}

                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}
