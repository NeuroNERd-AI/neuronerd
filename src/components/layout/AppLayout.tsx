import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { mockAlerts, mockCurrentUser } from '@/data/mockData';
import { Breadcrumbs } from './Breadcrumbs';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const unreadAlerts = mockAlerts.filter((alert) => !alert.read).length;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          menuOpen={sidebarOpen}
          user={mockCurrentUser}
          alertCount={unreadAlerts}
        />
        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
