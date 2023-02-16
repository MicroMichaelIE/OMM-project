import { NavDropdown } from 'react-bootstrap'
import { SignedInDropdown } from '../Items/SignedIn'
import { GuestDropdownItems } from '../Items/Guest'
import { Icon } from '../../Icon/Icon'
import { LoggedInUser } from '../../../types/types'
import './UserMenu.scss'
import { useNavigate } from 'react-router-dom'

interface UserMenuProps {
    logout: () => void
    signedIn: boolean
}

export const UserMenu = ({
    signedIn,
    logout,
}: UserMenuProps): JSX.Element => {
    const navigate = useNavigate()
    return signedIn ? (
        <div className="UserMenu">
            <div className="UserMenu__border">
                <div
                    className="UserMenu__image"
                    onClick={() => navigate('/profile')}
                >
                    <Icon name="person" />
                </div>
                <NavDropdown
                    align="end"
                    className="DropDownText"
                    title={Icon({ name: 'menu' })}
                >
                    <SignedInDropdown
                        username={'Profile'}
                        handleLogout={logout}
                    />
                </NavDropdown>
            </div>
        </div>
    ) : (
        <div className="UserMenu">
            <NavDropdown
                align="end"
                className="DropDownText"
                title={Icon({ name: 'menu' })}
            >
                <GuestDropdownItems />
            </NavDropdown>
        </div>
    )
}
