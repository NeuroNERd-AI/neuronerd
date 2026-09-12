import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sectionLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  alerts: 'Alerts',
  settings: 'Settings',
  activity: 'Activity',
  games: 'Games',
  reminders: 'Reminders',
  memories: 'Memories',
};

function getLabel(segment: string, index: number): string {
  if (index === 1 && segment.startsWith('p-')) return 'Patient profile';
  return sectionLabels[segment] ?? 'Page';
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.filter((segment) => segment !== 'login');

  if (pathname === '/dashboard' || pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      {crumbs.map((segment, index) => {
        const href = `/${crumbs.slice(0, index + 1).join('/')}`;
        const isLast = index === crumbs.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
            {isLast ? (
              <span className="px-1.5 py-1 font-medium text-slate-700" aria-current="page">
                {getLabel(segment, index)}
              </span>
            ) : (
              <Link
                to={href}
                className="rounded-md px-1.5 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                {getLabel(segment, index)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
