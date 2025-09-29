import { Home } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  return (
    <div className="size-full h-dvh">
      <button onClick={() => navigate('/')} className="fixed top-3.5 right-3.5 rounded-lg p-2 shadow max-sm:p-1.5">
        <Home size="20" />
      </button>

      <Outlet />
    </div>
  );
}

export default Profile;
