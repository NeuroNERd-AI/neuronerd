import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AlertsPage } from '@/pages/AlertsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GameAnalyticsPage } from '@/pages/GameAnalyticsPage';
import { LoginPage } from '@/pages/LoginPage';
import { MemoriesPage } from '@/pages/MemoriesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PatientDetailPage } from '@/pages/PatientDetailPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { SettingsPage } from '@/pages/SettingsPage';

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
      Loading...
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
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
    </Routes>
  );
}

export default App;
