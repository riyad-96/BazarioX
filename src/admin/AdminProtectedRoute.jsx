import { Navigate } from 'react-router-dom';
import { useUniContexts } from '../contexts/UniContexts';
import toast from 'react-hot-toast';

function AdminProtectedRoute({ children }) {
  const { isAdmin } = useUniContexts();
  if (!isAdmin()) {
    toast.error('Only authorized user can visit admin page', { duration: 4000 });
    return <Navigate to={'/'} />;
  }
  return children;
}

export default AdminProtectedRoute;
