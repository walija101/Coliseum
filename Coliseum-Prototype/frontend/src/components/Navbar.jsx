import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMessage, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/', icon: faHome, label: 'Home', includePaths: ['/', '/add-friends'] },
    { to: '/messages', icon: faMessage },
    { to: '/notifications', icon: faBell },
    { to: '/profile', icon: faUser },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gold p-4 flex justify-around lg:hidden">
      {links.map((link) => {
          const isActive = link.includePaths 
            ? link.includePaths.some(path => location.pathname === path)
            : location.pathname.startsWith(link.to) && (link.to === '/' ? location.pathname === '/' : true);
        
            return (
          <Link
            key={link.to}
            to={link.to}
            className={`
              flex items-center justify-center
              w-12 h-12
              rounded-md
              transition-all duration-200
              ${isActive ? 
                'bg-navbarItemGold text-iconRed shadow-md transform scale-105' : 
                'text-sand hover:text-iconRed hover:bg-navbarItemGold'
              }
            `}
          >
            <FontAwesomeIcon 
              icon={link.icon} 
              className="text-xl"
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;