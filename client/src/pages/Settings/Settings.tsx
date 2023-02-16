import { useEffect, useState } from 'react'

export const Settings = () => {
    useEffect(() => {
        console.log('Settings')
    }, [])

    return (
        <div className="Settings">
            <h1>Settings</h1>
        </div>
    )
}
