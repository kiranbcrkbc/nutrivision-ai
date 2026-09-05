import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../services/authStore';
import { AccessDeniedPage } from '../../pages/AccessDeniedPage';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RoleProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles: Array<'ROLE_USER' | 'ROLE_ADMIN'>;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" label="Verifying permissions..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};
