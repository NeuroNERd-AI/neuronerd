import { ArrowRight, Check, Clock3, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alert } from '@/types';
import { alertSeverityConfig, alertTypeConfig, AlertBadge, AlertTypeBadge, ReadStatusBadge } from '@/components/alerts/AlertBadge';

interface AlertCardProps {
  alert: Alert;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatAlertTime(value: string): string {
  const date = new Date(value);
  const now = endOfToday();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
}

export function AlertCard({ alert, onMarkRead, onMarkUnread }: AlertCardProps) {
  const { icon: SeverityIcon, classes: severityClasses } = alertSeverityConfig[alert.severity];
  const { icon: TypeIcon } = alertTypeConfig[alert.type];
  const isUnread = !alert.read;

  return (
    <article
      className={`flex gap-3 border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 ${
        isUnread ? 'bg-blue-50/30' : ''
      }`}
    >
      <div className="relative shrink-0">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${severityClasses}`}>
          <SeverityIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        {isUnread && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white"
            aria-label="Unread alert"
            role="status"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{alert.title}</h3>
          <AlertBadge severity={alert.severity} />
          <AlertTypeBadge type={alert.type} />
          <ReadStatusBadge read={alert.read} />
        </div>

        <p className="mt-1 text-sm leading-5 text-slate-600">{alert.message}</p>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {alert.patientName !== 'System' ? alert.patientName : 'System'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {formatAlertTime(alert.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isUnread ? (
              <button
                type="button"
                onClick={() => onMarkRead(alert.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                aria-label={`Mark ${alert.title} as read`}
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> Mark read
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onMarkUnread(alert.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                aria-label={`Mark ${alert.title} as unread`}
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Mark unread
              </button>
            )}
            {alert.action && (
              <Link
                to={alert.action.href}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                {alert.action.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            {alert.patientId && !alert.action && (
              <Link
                to={`/patients/${alert.patientId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View patient <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
