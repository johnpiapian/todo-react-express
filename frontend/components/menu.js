import { slide as Menu } from 'react-burger-menu';

const MyMenu = ({ user }) => {
    return (
        <Menu right>
            <span className="menu-item name">Hello, <i>{user.name}</i>!</span>
            <a id="home" className="menu-item" href="/">Home</a>
            <a id="about" className="menu-item" href="/?logout=1">Logout</a>
        </Menu>
    );
}

export default MyMenu;