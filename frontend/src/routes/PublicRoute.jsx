import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isProfileComplete, hasCompletedPlacement } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (isAuthenticated) {
    // Redirect based on user status
    if (!isProfileComplete) {
      return <Navigate to="/introduction" replace />;
    }
    if (!hasCompletedPlacement) {
      return <Navigate to="/placement-test" replace />;
    }
    
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;