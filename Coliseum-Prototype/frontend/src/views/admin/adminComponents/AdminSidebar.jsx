import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function AdminSidebar(){
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/admin/home', label: 'Home' },
    // { to: '/admin/banRequests', label: 'Ban Requests' },
    // { to: '/admin/modsOverview', label: 'Mods Overview' },
    // { to: 'admin/dbOverview', label: 'DB Overview'}
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gold p-4 flex flex-col gap-4">
      <div className="mb-8 px-4 text-fontBrown">
        <h1 className="text-3xl font-bold ">Admin Panel</h1>
        <p className='font-cinzel'>Coliseum</p>
        <p className="">Your Friends, Your Filters</p>
      </div>

      {links.map((link) => {
        const isActive = location.pathname === link.to;
        
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`
              px-4 py-3 rounded-md
              ${isActive ? 'bg-amber-200' : 'hover:bg-amber-200'}
              text-amber-900 transition-colors
            `}
          >
            {link.label}
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-3 rounded-md hover:bg-amber-200 text-amber-900 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminSidebar;