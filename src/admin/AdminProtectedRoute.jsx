import { Navigate } from 'react-router-dom';
import { useUniContexts } from '../contexts/UniContexts';

function AdminProtectedRoute({ children }) {
  const { isAdmin } = useUniContexts();
  if (!isAdmin()) {
    return <Navigate to={'/'} />;
  }
  return children;
}

export default AdminProtectedRoute;
