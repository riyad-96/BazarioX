import kitzo from 'kitzo';
import { Calculator, CalendarClock, CalendarSearch } from 'lucide-react';
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
    <div className={`relative z-10 border-t-1 border-(--slick-border) bg-(--primary) text-(--text-clr) ${className}`}>
      <div className="mx-auto flex h-full max-w-[700px] items-center font-medium select-none">
        <div onClick={() => navigate('/', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link flex items-center gap-2 rounded-full px-6 py-2.5 transition-colors duration-300`}>
            <span>
              <Calculator size="18" />
            </span>
            <span className="max-sm:text-sm">Calc</span>
          </NavLink>
        </div>

        <div onClick={() => navigate('/today', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/today" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link flex items-center gap-2 rounded-full px-6 py-2.5 transition-colors duration-300`}>
            <span>
              <CalendarClock size="18" />
            </span>
            <span className="max-sm:text-sm">Today</span>
          </NavLink>
        </div>

        <div onClick={() => navigate('/monthly', { replace: true })} className="flex h-full flex-1 items-center justify-center">
          <NavLink replace to="/monthly" className={({ isActive }) => `${isActive ? 'bg-(--nav-link-bg)' : 'bg-(--primary)'} nav-link flex items-center gap-2 rounded-full px-6 py-2.5 transition-colors duration-300`}>
            <span>
              <CalendarSearch size="18" />
            </span>
            <span className="max-sm:text-sm">Monthly</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TabBar;
