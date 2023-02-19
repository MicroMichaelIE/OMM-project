import { useState } from 'react'

export const useLocalStorage = () => {

    const setItem = (key: string, value: string) => {
        localStorage.setItem(key, value)
        return true
    }

    const getItem = (key: string) => {
        const windowValue = localStorage.getItem(key)
        return windowValue
    }

    const removeItem = (key: string) => {
        localStorage.removeItem(key)
        return true
    }

    return { setItem, getItem, removeItem }
}
