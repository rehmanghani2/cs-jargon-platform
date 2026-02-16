import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Loader from '@components/common/Loader';

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User is authenticated but doesn't have permission
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user needs to complete introduction
  if (!user?.hasCompletedIntroduction && location.pathname !== '/introduction') {
    return <Navigate to="/introduction" replace />;
  }

  // User is authenticated and has permission
  return <Outlet />;
}

export default ProtectedRoute;