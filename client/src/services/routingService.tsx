import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '../components/Spinner/Spinner'
import useAuth from '../hooks/useAuth'

interface ProtectedLoginRouteProps {
    accessLevel?: 'Admin' | 'Lender' | 'Borrower' | 'Both' | 'Guest'
    redirectPath?: string
    children?: JSX.Element
}

export const ProtectedLoginRoute = ({
    // accessLevel = 'Both',
    redirectPath = '/feed',
    children,
}: ProtectedLoginRouteProps): JSX.Element => {
    const { loadingInitial, isAuthenticated } = useAuth()

    //const hasAccess = user.roles.includes(accessLevel)
    //const isAllowed = user.token && hasAccess



    if (!loadingInitial) {
        if (!isAuthenticated) {
            return <Navigate to={redirectPath} replace />
        }

        return children ? children : <Outlet />
    } else {
        return <Spinner />
    }
}
