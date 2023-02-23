import React from 'react'
import ReactDOM from 'react-dom/client'

// PWA register
import { registerSW } from 'virtual:pwa-register'

import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
    Outlet,
} from 'react-router-dom'

import './index.scss'
import reportWebVitals from './reportWebVitals'

import App from './app/App'
import NotFound from './pages/NotFound/NotFound'
import { Login } from './pages/Login/Login'
import { SignUp } from './pages/SignUp/SignUp'
import { Editor } from './pages/Editor/Editor'
import { ProtectedLoginRoute } from './services/routingService'
import { Profile } from './pages/Profile/Profile'
import { Settings } from './pages/Settings/Settings'
import { Feed } from './pages/Feed/Feed'
import { TemplateList } from './pages/Templates/Templates'
import UploadPage from './pages/TemplateUpload/Main/Main'
import { MemeViewer } from './pages/MemeViewer/MemeViewer'

const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
        const or = document.createElement('div')
        or.id = 'offline-ready'
        or.innerHTML = `
            <div class="inner-Modal">
                <h1>Update available!</h1>
                <p>Click to refresh</p>
            </div>
        `

        or.addEventListener('click', () => {
            updateSW()
            or.remove()
        })
        console.log('update available')
    },
    onRegisteredSW() {
        // show a ready to work offline to user
        const or = document.createElement('div')
        or.id = 'offline-ready'
        or.innerHTML = `
            <div class="inner-Modal">
                <h1>Ready to work offline!</h1>
                <p>Click anywhere to close</p>
            </div>
        `
        or.addEventListener('click', () => {
            or.remove()
        })
        console.log('ready to work offline')

        document.getElementById('root')!.appendChild(or)
    },
})

updateSW()

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} errorElement={<NotFound />}>
            <Route path="/" element={<Editor />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="feed" element={<Feed />} />
            <Route path="templates" element={<TemplateList />} />
            <Route element={<ProtectedLoginRoute />}>
                <Route path="upload" element={<UploadPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Route>
    )
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
