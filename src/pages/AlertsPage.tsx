import { useMemo, useState } from 'react';
import { Bell, BellOff, CheckCheck, Clock3, CloudOff, Gamepad2, CalendarX } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AlertList } from '@/components/alerts/AlertList';
import { AlertFilters, type SeverityFilter, type TypeFilter, type ReadFilter } from '@/components/alerts/AlertFilters';
import { mockAlerts } from '@/data/mockData';
import type { Alert, AlertType } from '@/types';

const alertTypeIcons: Record<AlertType, typeof Bell> = {
  missed_reminder: CalendarX,
  unusual_inactivity: Clock3,
  failed_sync: CloudOff,
  incomplete_session: Gamepad2,
  system_notification: BellOff,
};

const alertTypeLabels: Record<AlertType, string> = {
  missed_reminder: 'Missed Reminders',
  unusual_inactivity: 'Unusual Inactivity',
  failed_sync: 'Failed Syncs',
  incomplete_session: 'Incomplete Sessions',
  system_notification: 'System Notifications',
};

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((a) => severityFilter === 'all' || a.severity === severityFilter)
      .filter((a) => typeFilter === 'all' || a.type === typeFilter)
      .filter((a) => {
        if (readFilter === 'all') return true;
        if (readFilter === 'unread') return !a.read;
        return a.read;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [alerts, severityFilter, typeFilter, readFilter]);

  const counts = useMemo(() => ({
    total: alerts.length,
    unread: alerts.filter((a) => !a.read).length,
    read: alerts.filter((a) => a.read).length,
  }), [alerts]);

  const typeCounts = useMemo(() => {
    const types: AlertType[] = ['missed_reminder', 'unusual_inactivity', 'failed_sync', 'incomplete_session', 'system_notification'];
    return types.map((type) => ({
      type,
      count: alerts.filter((a) => a.type === type).length,
      unread: alerts.filter((a) => a.type === type && !a.read).length,
    }));
  }, [alerts]);

  const handleMarkRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  };

  const handleMarkUnread = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: false } : a));
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const hasUnread = counts.unread > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Alerts"
        description="Notifications and updates that may need your attention"
        actions={
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!hasUnread}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Bell className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </div>
          <div><p className="text-xs text-slate-500">Total</p><p className="text-lg font-bold text-slate-900">{counts.total}</p></div>
        </div>
        {typeCounts.map(({ type, count, unread }) => {
          const Icon = alertTypeIcons[type];
          const hasUnreadType = unread > 0;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              className={`card flex items-center gap-3 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                typeFilter === type ? 'ring-2 ring-blue-500/20' : ''
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                hasUnreadType ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500">{alertTypeLabels[type]}</p>
                <p className="text-lg font-bold text-slate-900">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <AlertFilters
          severity={severityFilter}
          type={typeFilter}
          read={readFilter}
          onSeverityChange={setSeverityFilter}
          onTypeChange={setTypeFilter}
          onReadChange={setReadFilter}
          counts={counts}
        />
      </div>

      <AlertList alerts={filteredAlerts} onMarkRead={handleMarkRead} onMarkUnread={handleMarkUnread} />

      <p className="mt-6 text-xs text-slate-400">
        Alerts reflect application events such as missed reminders, inactivity, and sync issues. They are not medical notifications.
      </p>
    </div>
  );
}
