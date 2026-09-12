import type { AlertSeverity, AlertType } from '@/types';
import { Bell, BellOff, CalendarX, CloudOff, Gamepad2, TriangleAlert, Info, Clock } from 'lucide-react';

export const alertSeverityConfig: Record<AlertSeverity, { icon: typeof Info; classes: string; badgeClasses: string; label: string }> = {
  info: { icon: Info, classes: 'bg-blue-50 text-blue-600', badgeClasses: 'bg-blue-100 text-blue-700', label: 'Info' },
  warning: { icon: TriangleAlert, classes: 'bg-amber-50 text-amber-600', badgeClasses: 'bg-amber-100 text-amber-700', label: 'Warning' },
  critical: { icon: Bell, classes: 'bg-red-50 text-red-600', badgeClasses: 'bg-red-100 text-red-700', label: 'Critical' },
};

export const alertTypeConfig: Record<AlertType, { icon: typeof Bell; label: string }> = {
  missed_reminder: { icon: CalendarX, label: 'Missed Reminder' },
  unusual_inactivity: { icon: Clock, label: 'Unusual Inactivity' },
  failed_sync: { icon: CloudOff, label: 'Failed Sync' },
  incomplete_session: { icon: Gamepad2, label: 'Incomplete Session' },
  system_notification: { icon: BellOff, label: 'System Notification' },
};

interface AlertBadgeProps {
  severity: AlertSeverity;
}

export function AlertBadge({ severity }: AlertBadgeProps) {
  const { badgeClasses, label } = alertSeverityConfig[severity];
  return <span className={`badge ${badgeClasses}`}>{label}</span>;
}

interface AlertTypeBadgeProps {
  type: AlertType;
}

export function AlertTypeBadge({ type }: AlertTypeBadgeProps) {
  const { icon: Icon, label } = alertTypeConfig[type];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      <Icon className="h-3 w-3" aria-hidden="true" /> {label}
    </span>
  );
}

interface ReadStatusBadgeProps {
  read: boolean;
}

export function ReadStatusBadge({ read }: ReadStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        read ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${read ? 'bg-slate-400' : 'bg-blue-500'}`}
        aria-hidden="true"
      />
      {read ? 'Read' : 'Unread'}
    </span>
  );
}
