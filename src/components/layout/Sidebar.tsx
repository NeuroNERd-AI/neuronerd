import { NavLink } from 'react-router-dom';
import {
  Bell,
  Brain,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-30 cursor-default bg-slate-950/40 transition-opacity duration-200 xl:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
      />
      <aside
        id="primary-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 xl:static xl:w-64 xl:translate-x-0 xl:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-2.5 rounded-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
              <Brain className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-900">NeuroNERd</span>
              <span className="block text-xs text-slate-500">Caregiver Dashboard</span>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 xl:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 pb-2 pt-6">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500">NeuroNERd Caregiver Portal</p>
          <p className="mt-1 text-xs text-slate-400">North Eastern Region, India</p>
        </div>
      </aside>
    </>
  );
}
