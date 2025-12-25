import { Bug, LayoutDashboard, MessageCircle, Telescope } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Sidebar({ state }) {
  const { sidebarOpen, setSidebarOpen } = state;

  return (
    <div onClick={() => setSidebarOpen(false)} className={`admin-sidebar h-full ${sidebarOpen && 'show'}`}>
      <div onClick={(e) => e.stopPropagation()} className="admin-sidebar-content grid h-full w-[230px] grid-rows-[auto_1fr] gap-4 rounded-xl bg-white p-3 shadow sm:w-[250px]">
        <div className="py-4">
          <h2 onClick={() => window.location.reload()} className="mx-auto w-fit text-center text-2xl select-none">
            Bazario
          </h2>
        </div>

        <div className="grid h-fit gap-0.5">
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} flex items-center gap-2 rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin"
            end
            replace
          >
            <span>
              <LayoutDashboard size="18" />
            </span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} flex items-center gap-2 rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/feedbacks"
            replace
          >
            <span>
              <MessageCircle size="20" />
            </span>
            <span>Feedbacks</span>
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} flex items-center gap-2 rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/feature-requests"
            replace
          >
            <span>
              <Telescope size="20" />
            </span>
            <span>Feature requests</span>
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} flex items-center gap-2 rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/reports"
            replace
          >
            <span>
              <Bug />
            </span>
            <span>Reports</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
