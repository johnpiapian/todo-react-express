import { slide as Menu } from 'react-burger-menu';

const MyMenu = () => {
    return (
        <Menu right>
            <a id="home" className="menu-item" href="/">Home</a>
            <a id="about" className="menu-item" href="/about">Logout</a>
        </Menu>
    );
}

export default MyMenu;