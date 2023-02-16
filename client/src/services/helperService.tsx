import { completeUserData } from '../types/types'

export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    return String(error)
}

export const convertDateToRelevantString = (date: string) => {
    const dateNew = new Date(date)
    const today = new Date()
    const diff = Math.abs(today.getTime() - dateNew.getTime())
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    if (diffDays < 7) {
        return 'This week'
    } else if (diffDays < 30) {
        return 'This month'
    } else if (diffDays < 365) {
        return 'This year'
    } else {
        return dateNew.toLocaleDateString()
    }
}

