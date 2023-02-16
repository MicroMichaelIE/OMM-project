import { useCallback, useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { LoggedInUser } from '../../types/types'

export const Profile = () => {
    const { getUser } = useAuth()

    const [user, setUser] = useState<LoggedInUser>()

    const getUserData = useCallback(async () => {
        const { user, ok } = await getUser()
        if (ok) {
            setUser(user)
        }
    }, [getUser])

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <div className="Profile">
            <h1>Profile</h1>
            <div className="Profile__info">
                <p>{user?.email}</p>
            </div>
        </div>
    )
}
