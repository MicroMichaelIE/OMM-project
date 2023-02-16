import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';

export const GuestDropdownItems = () => {
    const navigate = useNavigate();
    return (
        <>
            <NavDropdown.Item onClick={() => navigate('/login')}>Login</NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate('/signup')}>Sign Up</NavDropdown.Item>
        </>
    );
};
