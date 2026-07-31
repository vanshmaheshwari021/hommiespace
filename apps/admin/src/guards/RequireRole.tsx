import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';

interface RequireRoleProps {
  allowedRoles: ('admin' | 'vendor' | 'customer' | 'staff')[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  console.log('🛡️ RequireRole Guard Checked:', { isAuthenticated, user, allowedRoles });

  if (!isAuthenticated) {
    console.warn('⛔ RequireRole Guard: Not authenticated! Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    console.warn(`⛔ RequireRole Guard: Role ${user.role} not in allowedRoles ${allowedRoles.join(', ')}! Redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
