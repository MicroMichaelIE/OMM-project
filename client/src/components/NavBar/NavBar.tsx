import './NavBar.scss'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { UserMenu } from './UserMenu/UserMenu'

const NavBar = () => {
    // const navigate = useNavigate()
    //const { user, logout } = useAuth()
    const { userToken, logout } = useAuth()
    const signedIn = userToken ? true : false

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
    }
    return (
        <Navbar className="navBar">
            <Container>
                <Navbar.Brand className="Text">
                    <Link to="/">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="fullDiv">
                                <h1 style={{ margin: 0 }}>MEME Generator</h1>
                            </div>
                        </div>
                    </Link>
                </Navbar.Brand>
            </Container>
            <Container className="rightSide">
                <Nav.Link onClick={() => navigate('/feed')} className="Text">
                    Feed
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/templates')}
                    className="Text"
                >
                    Templates
                </Nav.Link>

                {/* TODO: Create Items here when in Desktop View should dissappear when in Mobile. AboutUs, ??, ??  */}
                <Navbar.Collapse id="basic-navbar-nav" style={{ flexGrow: 0 }}>
                    <Nav>
                        <UserMenu signedIn={signedIn} logout={handleLogout} />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
