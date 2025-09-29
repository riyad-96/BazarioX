import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import { useState } from 'react';

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-dvh bg-(--main-bg) p-2">
      <div className="mx-auto flex size-full max-w-[1200px] gap-3">
        <Sidebar state={{ sidebarOpen, setSidebarOpen }} />

        <div className="grid flex-1 grid-rows-[auto_1fr] gap-3">
          <NavBar state={{ setSidebarOpen }} />
          <div className="overflow-y-auto px-0.5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
