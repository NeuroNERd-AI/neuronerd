import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, role, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>Verifying authorization...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      if (role === 'patient') return <Navigate to="/patient/portal" replace />;
      if (role === 'healthcare_worker') return <Navigate to="/healthcare/portal" replace />;
      if (role === 'admin') return <Navigate to="/admin/portal" replace />;
      return <Navigate to="/portal-unavailable" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
