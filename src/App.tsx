import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
    </Routes>
  );
}

export default App;
