import {
    createContext,
    ReactNode,
    useState,
    useMemo,
    useEffect,
    useCallback,
    useContext,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoggedInUser } from '../types/types'
import { useLocalStorage } from '../hooks/useLocalStorage'

import { userAuth } from '../types/types'
import {
    loginBackend,
    signUpBackend,
    changePasswordBackend,
    verifyTokenBackend,
    getUserInfoBackend,
} from '../services/authService'
import { getErrorMessage } from '../services/helperService'

// Source: https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10

interface AuthContextType {
    loadingInitial: boolean
    loading: boolean
    error?: any
    login: (user: userAuth) => Promise<{
        ok: boolean
    }>
    signUp: (
        formData: userAuth,
        confirmPassword: string
    ) => Promise<{
        ok: boolean
    }>
    getUser: () => Promise<{
        ok: boolean
        user?: LoggedInUser
    }>
    isAuthenticated: boolean
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({
    children,
}: {
    children: ReactNode
}): JSX.Element {
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true)
    const [isAuthenticated, setIsAuthenicated] = useState<boolean>(false)
    // We are using `react-router` for this example,
    // but feel free to omit this or use the
    // router of your choice.
    const navigate = useNavigate()
    const location = useLocation()

    const { getItem, setItem, removeItem } = useLocalStorage()

    // If we change page, reset the error state.
    useEffect(() => {
        setError('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    const checkUserToken = useCallback(async () => {
        console.log(isAuthenticated)
        const thisuserToken = !isAuthenticated ? getItem('token') : null
        try {
            if (thisuserToken) {
                let { ok, message } = await verifyTokenBackend(thisuserToken)
                console.log(ok)
                if (ok) {
                    setIsAuthenicated(true)
                    return { ok: true }
                } else {
                    throw new Error(message)
                }
            } else {
                console.log('no token')
                navigate('/login')
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            console.log(errorMessage)
            navigate('/login')
            return { ok: false }
        } finally {
            setLoadingInitial(false)
        }
    }, [isAuthenticated])


    // Checks if the user is logged in and if so, sets the user
    useEffect(() => {
        checkUserToken()
    }, [])

    const login = async (userForm: userAuth) => {
        setLoading(true)

        try {
            const { token, ok, message } = await loginBackend(userForm)

            if (ok && token) {
                setItem('token', token)
                setIsAuthenicated(true)
                return { ok: true }
            } else {
                console.log(message)
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return { ok: false }
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (
        { username, password }: userAuth,
        confirmPassword: string
    ) => {
        if (!checkPasswordsMatch(password, confirmPassword)) {
            setError('Passwords do not match')
            return { ok: false }
        }
        try {
            let { token, ok, message } = await signUpBackend({
                username,
                password,
            })
            console.log(ok, message)

            if (ok) {
                setIsAuthenicated(true)
                setItem('token', token)
                return { ok: true }
            } else {
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return { ok: false }
        }
    }

    const checkToken = async () => {
        const thisuserToken = isAuthenticated && getItem('token')
        try {
            if (thisuserToken) {
                let { ok, message } = await verifyTokenBackend(thisuserToken)
                console.log(ok)
                if (ok) {
                    return { ok: true }
                } else {
                    throw new Error(message)
                }
            } else {
                return { ok: false }
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return { ok: false }
        }
    }

    const getUser = async () => {
        const userToken = isAuthenticated && getItem('token')
        try {
            if (userToken) {
                const { ok, userInfo } = await getUserInfoBackend(userToken)
                if (ok) {
                    return { ok: true, user: userInfo }
                } else {
                    throw new Error('Could not get user info')
                }
            } else {
                return { ok: false }
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return { ok: false }
        }
    }

    const logout = () => {
        console.log('logout')
        setIsAuthenicated(false)
        removeItem('token')
        navigate('/feed')
    }

    // const getUserToken = getItem('token')

    const checkPasswordsMatch = (password: string, confirmPassword: string) => {
        if (password === '') {
            // Here we can check password length, etc.
            setError('Please enter a password')
            return false
        } else if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        } else {
            return true
        }
    }

    // we want to keep things very performant.
    const memoedValue = useMemo(
        () => ({
            loadingInitial,
            loading,
            isAuthenticated,
            // getUserToken,
            error,
            getUser,
            login,
            signUp,
            logout,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isAuthenticated, loading, error, checkToken]
    )

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}
