//IMPORTS
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

//Styles
import './NotFound.scss'

function NotFound() {
    const navigate = useNavigate()

    //EFFECT HOOK
    useEffect(() => {
        console.log('Found 404')
    }, [])

    //RENDER
    return (
        <div className="NotFound">
            <h1>404</h1>
            <h2>Page not found</h2>
            <button onClick={() => navigate('/')}>Go to home</button>
        </div>
    )
}

export default NotFound
