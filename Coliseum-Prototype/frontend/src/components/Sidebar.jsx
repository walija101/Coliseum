import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMessage, faBell, faUser, faArrowLeft, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { logout, setAuthToken } from '../api/apiService';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const links = [
        { to: '/', icon: faHome, label: 'Home', includePaths: ['/', '/add-friends'] },
        { to: '/messages', icon: faMessage, label: 'Messages' },
        { to: '/notifications', icon: faBell, label: 'Notifications' },
        { to: '/profile', icon: faUser, label: 'Profile' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            setAuthToken(null);
            navigate('/login');
        } catch (error) {
            console.error('logout failed', error);
            alert('logout failed')
        }
        alert("Logged out!")
    };


    return (
        <nav className={`fixed left-0 top-0 h-full bg-gold p-4 flex flex-col gap-4 transition-all font-playfair duration-300 
            ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`${isCollapsed ? 'flex justify-center' : 'mb-8 px-4'}`}>
                <div className="flex items-center text-fontBrown leading-none text-center justify-between">
                    {!isCollapsed && <h1 className="text-3xl font-cinzel">COLISEUM</h1>}
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-navbarItemGold text-fontBrown transition-colors"
                    >
                        <FontAwesomeIcon 
                            icon={faArrowLeft} 
                            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
                {!isCollapsed && <p className="font-playfair">Your Friends, Your Filters</p>}
            </div>

            {links.map((link) => {
                const isActive = link.includePaths 
                    ? link.includePaths.some(path => location.pathname === path)
                    : location.pathname.startsWith(link.to) && (link.to === '/' ? location.pathname === '/' : true);
                                
                return (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`
                            flex items-center gap-4 px-4 py-3
                            rounded-md ${ isCollapsed ? 'justify-center' : ''}
                            transition-all duration-200
                            ${isActive ? 
                            'bg-navbarItemGold shadow-md' : 
                            'hover:bg-navbarItemGold'
                            }
                            text-fontBrown
                        `}
                    >
                        <FontAwesomeIcon 
                            icon={link.icon} 
                            className={`text-xl ${isActive ? 'text-iconRed' : 'text-fontBrown'}`}
                        />
                        {!isCollapsed && <span className={isActive ? 'text-fontBrown' : ''}>{link.label}</span>}
                    </Link>
                );
            })}
            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 hover:bg-navbarItemGold text-fontBrown"
            >
                <FontAwesomeIcon icon={faSignOut} className="text-xl" />
                {!isCollapsed && <span>Logout</span>}
            </button>
        </nav>
    );
};

export default Sidebar;