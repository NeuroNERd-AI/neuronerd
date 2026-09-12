import { Bell, Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@/types';

interface TopbarProps {
  onMenuClick: () => void;
  menuOpen: boolean;
  user: User;
  alertCount?: number;
}

export function Topbar({ onMenuClick, menuOpen, user, alertCount = 0 }: TopbarProps) {
  const roleLabel = user.role.replace('_', ' ');

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 xl:hidden"
        aria-label="Open navigation menu"
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm font-semibold text-slate-800">Care team workspace</p>
        <p className="truncate text-xs text-slate-500">Supporting everyday wellbeing</p>
      </div>

      <div className="relative ml-auto hidden w-full max-w-sm md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search patients or alerts"
          className="input pl-9"
          aria-label="Search patients or alerts"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-3">
        <Link
          to="/alerts"
          className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label={`View alerts${alertCount > 0 ? `, ${alertCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {alertCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white" aria-hidden="true">
              {alertCount}
            </span>
          )}
        </Link>

        <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 sm:ml-2 sm:pl-4" aria-label={`Signed in as ${user.name}, ${roleLabel}`}>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs capitalize text-slate-500">{roleLabel}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700" aria-hidden="true">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
