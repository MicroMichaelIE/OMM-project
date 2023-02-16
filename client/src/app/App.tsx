import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from '../components/NavBar/NavBar'

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <NavBar />
                <Outlet />
                {/* {isMobile && <MobileBottomNav />} */}
            </AuthProvider>
        </div>
    )
}

export default App
