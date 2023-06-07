import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';

const MyMenu = ({ user }) => {
    return (
        <Menu right>
            <span className="menu-item name">Hello, <i>{user.name}</i>!</span>
            <Link id="home" className="menu-item" href="/">Home</Link>
            <Link id="about" className="menu-item" href="/?logout=1">Logout</Link>
        </Menu>
    );
}

export default MyMenu;