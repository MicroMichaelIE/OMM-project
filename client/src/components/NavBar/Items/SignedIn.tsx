import NavDropdown from 'react-bootstrap/NavDropdown'
import { useNavigate } from 'react-router-dom'

type SignedInDropdownProps = {
    username?: string
    handleLogout: () => void
}

export const SignedInDropdown = ({
    username,
    handleLogout,
}: SignedInDropdownProps) => {
    const navigate = useNavigate()
    return (
        <>
            <NavDropdown.Item onClick={() => navigate('/upload')}>
                Upload Templates
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate('/settings')}>
                Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </>
    )
}
