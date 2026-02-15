import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

const ProtectedRoute = ({ children, requireProfile = false, requirePlacement = false }) => {
  const { isAuthenticated, isLoading, isProfileComplete, hasCompletedPlacement } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if profile completion is required
  if (requireProfile && !isProfileComplete) {
    return <Navigate to="/introduction" replace />;
  }

  // Check if placement test is required
  if (requirePlacement && !hasCompletedPlacement) {
    return <Navigate to="/placement-test" replace />;
  }

  return children;
};

export default ProtectedRoute;