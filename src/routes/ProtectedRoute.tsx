import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role to lowercase for comparison
  const userRoleLower = user.role.toLowerCase();
  const allowedRolesLower = allowedRoles?.map(r => r.toLowerCase());

  if (allowedRolesLower && !allowedRolesLower.includes(userRoleLower)) {
    return <Navigate to={`/${userRoleLower}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
