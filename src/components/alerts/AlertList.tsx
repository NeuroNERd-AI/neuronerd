import { Bell, CheckCircle2 } from 'lucide-react';
import type { Alert } from '@/types';
import { AlertCard } from '@/components/alerts/AlertCard';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface AlertListProps {
  alerts: Alert[];
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
}

export function AlertList({ alerts, onMarkRead, onMarkUnread }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No alerts found"
          description="There are no alerts matching the current filters. Try adjusting your filters."
          icon={CheckCircle2}
        />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-600">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div>
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
          />
        ))}
      </div>
    </div>
  );
}
