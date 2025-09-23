import { Navigate } from 'react-router-dom';
import { useUniContexts } from '../contexts/UniContexts';
import AppLoading from '../components/helpers/AppLoading';

function ProfileProtectedRoute({ children }) {
  const { isUserLoading, user } = useUniContexts();

  if (isUserLoading) return <AppLoading />;

  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default ProfileProtectedRoute;
