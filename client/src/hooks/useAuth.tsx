import {
    createContext,
    ReactNode,
    useState,
    useMemo,
    useEffect,
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
    checkToken: () => Promise<{ ok: boolean }>
    logout: () => void
    userToken: string | null
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({
    children,
}: {
    children: ReactNode
}): JSX.Element {
    const [userToken, setUserToken] = useState<string | null>(null)
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true)
    // We are using `react-router` for this example,
    // but feel free to omit this or use the
    // router of your choice.
    const navigate = useNavigate()
    const location = useLocation()

    const { getItem, setItem } = useLocalStorage()

    // If we change page, reset the error state.
    useEffect(() => {
        if (error !== '') setError('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    // Checks if the user is logged in and if so, sets the user
    useEffect(() => {
        let currentToken = getItem('token')
        if (currentToken) {
            setUserToken(currentToken)
        }
        setLoadingInitial(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const login = async (userForm: userAuth) => {
        setLoading(true)

        try {
            const { token, ok, message } = await loginBackend(userForm)

            if (ok && token) {
                setUserToken(token)
                setItem('token', token)
                return { ok: true }
            } else {
                console.log(message)
                throw new Error(message)
                return { ok: false }
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
        { email, password }: userAuth,
        confirmPassword: string
    ) => {
        if (!checkPasswordsMatch(password, confirmPassword)) {
            setError('Passwords do not match')
            return { ok: false }
        }
        try {
            let { token, ok, message } = await signUpBackend({
                email,
                password,
            })
            console.log(ok, message)

            if (ok) {
                setUserToken(token)
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
        try {
            if (userToken) {
                let { ok, message } = await verifyTokenBackend(userToken)
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
        setUserToken(null)
        navigate('/feed')
    }

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
            userToken,
            loading,
            error,
            getUser,
            login,
            signUp,
            checkToken,
            logout,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userToken, loading, error]
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
