import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AlertsPage } from '@/pages/AlertsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GameAnalyticsPage } from '@/pages/GameAnalyticsPage';
import { LoginPage } from '@/pages/LoginPage';
import { MemoriesPage } from '@/pages/MemoriesPage';
import { NotAvailablePage } from '@/pages/NotAvailablePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PatientDetailPage } from '@/pages/PatientDetailPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { SettingsPage } from '@/pages/SettingsPage';

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

function PublicRoute() {
  const { user, role, loading, profileLoading } = useAuth();

  if (loading || profileLoading) return <AuthLoading />;

  if (user) {
    if (role === 'caregiver') return <Navigate to="/dashboard" replace />;
    if (role === 'patient') return <Navigate to="/patient/portal" replace />;
    if (role === 'healthcare_worker') return <Navigate to="/healthcare/portal" replace />;
    if (role === 'admin') return <Navigate to="/admin/portal" replace />;
    return <Navigate to="/portal-unavailable" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      {/* Public routes (unauthenticated) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated routes boundary */}
      <Route element={<RoleGuard />}>
        {/* Role-appropriate placeholder areas for non-caregivers */}
        <Route path="/patient/portal" element={<NotAvailablePage targetRole="patient" />} />
        <Route path="/healthcare/portal" element={<NotAvailablePage targetRole="healthcare_worker" />} />
        <Route path="/admin/portal" element={<NotAvailablePage targetRole="admin" />} />
        <Route path="/portal-unavailable" element={<NotAvailablePage />} />

        {/* Caregiver-only application routes */}
        <Route element={<RoleGuard allowedRoles={['caregiver']} />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:patientId" element={<PatientDetailPage />} />
            <Route path="patients/:patientId/:section" element={<PatientDetailPage />} />
            <Route path="patients/:patientId/games/analytics" element={<GameAnalyticsPage />} />
            <Route path="patients/:patientId/reminders/manage" element={<RemindersPage />} />
            <Route path="patients/:patientId/memories/manage" element={<MemoriesPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
