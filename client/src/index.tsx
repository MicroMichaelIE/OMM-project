import React from 'react'
import ReactDOM from 'react-dom/client'

import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom'

import './index.scss'
import reportWebVitals from './reportWebVitals'

import App from './app/App'
import NotFound from './pages/NotFound/NotFound'
import { Login } from './pages/Login/Login'
import { SignUp } from './pages/SignUp/SignUp'
import { TemplateUpload } from './pages/TemplateUpload/TemplateUpload'
import { Editor } from './pages/Editor/Editor'
import { ProtectedLoginRoute } from './services/routingService'
import { Profile } from './pages/Profile/Profile'
import { Settings } from './pages/Settings/Settings'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} errorElement={<NotFound />}>
            <Route path="/" element={<Editor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedLoginRoute />}>
                <Route path="/upload" element={<TemplateUpload />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
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
