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
    redirectPath = '/login',
    children,
}: ProtectedLoginRouteProps): JSX.Element => {
    const { loadingInitial, checkToken } = useAuth()

    //const hasAccess = user.roles.includes(accessLevel)
    //const isAllowed = user.token && hasAccess

    const isAllowed = checkToken().then((res) => {
        return res.ok
    })

    if (!loadingInitial) {
        if (!isAllowed) {
            return <Navigate to={redirectPath} replace />
        }

        return children ? children : <Outlet />
    } else {
        return <Spinner />
    }
}
