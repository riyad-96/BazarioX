import { useUniContexts } from '../contexts/UniContexts';
import AppLoading from '../components/helpers/AppLoading';
import { Navigate } from 'react-router-dom';

function AuthProtectedRoute({ children }) {
  const { user, isUserLoading } = useUniContexts();

  if (isUserLoading) return <AppLoading />;

  if (user) return <Navigate to="/" replace />;

  return children;
}

export default AuthProtectedRoute;
