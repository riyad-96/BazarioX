import kitzo from 'kitzo';
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function TabBar({ className }) {
  const navigate = useNavigate();

  useEffect(() => {
    kitzo.ripple('.nav-link', {
      color: 'hsl(0, 0%, 50%, 0.5)',
      duration: 0.5,
      opacity: 0.5,
    });
  }, []);

  return (
    <div className={`border-t-1 relative z-10 border-(--slick-border) bg-(--primary) text-(--text-clr) ${className}`}>
      <div className="flex h-full items-center px-2 font-medium select-none">
        <div onClick={() => navigate('/', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link rounded-full px-6 py-2 transition-colors duration-300`}>
            <span>Calc</span>
          </NavLink>
        </div>
        <div onClick={() => navigate('/today', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/today" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link rounded-full px-6 py-2 transition-colors duration-300`}>
            <span>Today</span>
          </NavLink>
        </div>
        <div onClick={() => navigate('/monthly', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/monthly" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link rounded-full px-6 py-2 transition-colors duration-300`}>
            <span>Monthly</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TabBar;
