import { NavLink } from 'react-router-dom';

function Sidebar({ state }) {
  const { sidebarOpen, setSidebarOpen } = state;

  return (
    <div onClick={() => setSidebarOpen(false)} className={`admin-sidebar h-full ${sidebarOpen && 'show'}`}>
      <div onClick={(e) => e.stopPropagation()} className="admin-sidebar-content grid h-full w-[230px] sm:w-[250px] grid-rows-[auto_1fr] gap-4 rounded-xl bg-white p-3 shadow">
        <div className="py-4">
          <h2 onClick={() => window.location.reload()} className="mx-auto w-fit text-center text-2xl select-none">
            KitzoBazar
          </h2>
        </div>

        <div className="grid h-fit gap-0.5">
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin"
            end
            replace
          >
            Dashboard
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/feedbacks"
            replace
          >
            Feedbacks
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/feature-requests"
            replace
          >
            Feature requests
          </NavLink>
          <NavLink
            onClick={() => {
              if (sidebarOpen) {
                setSidebarOpen(false);
              }
            }}
            className={({ isActive }) => `${isActive && 'bg-zinc-100'} rounded-lg px-3 py-2 pointer-fine:hover:bg-(--main-bg)`}
            to="/admin/reports"
            replace
          >
            Reports
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
