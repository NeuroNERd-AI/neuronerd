import type { AlertSeverity, AlertType } from '@/types';
import { Bell, CalendarX, CheckCircle2, CloudOff, Clock, Filter, Gamepad2, Info, Mail, MailOpen, TriangleAlert } from 'lucide-react';

export type SeverityFilter = 'all' | AlertSeverity;
export type TypeFilter = 'all' | AlertType;
export type ReadFilter = 'all' | 'unread' | 'read';

interface AlertFiltersProps {
  severity: SeverityFilter;
  type: TypeFilter;
  read: ReadFilter;
  onSeverityChange: (value: SeverityFilter) => void;
  onTypeChange: (value: TypeFilter) => void;
  onReadChange: (value: ReadFilter) => void;
  counts: { total: number; unread: number; read: number };
}

const severityOptions: { value: SeverityFilter; label: string; icon: typeof Info }[] = [
  { value: 'all', label: 'All severities', icon: Filter },
  { value: 'info', label: 'Info', icon: Info },
  { value: 'warning', label: 'Warning', icon: TriangleAlert },
  { value: 'critical', label: 'Critical', icon: Bell },
];

const typeOptions: { value: TypeFilter; label: string; icon: typeof Bell }[] = [
  { value: 'all', label: 'All types', icon: Filter },
  { value: 'missed_reminder', label: 'Missed Reminder', icon: CalendarX },
  { value: 'unusual_inactivity', label: 'Unusual Inactivity', icon: Clock },
  { value: 'failed_sync', label: 'Failed Sync', icon: CloudOff },
  { value: 'incomplete_session', label: 'Incomplete Session', icon: Gamepad2 },
  { value: 'system_notification', label: 'System Notification', icon: Bell },
];

const readOptions: { value: ReadFilter; label: string; icon: typeof Mail }[] = [
  { value: 'all', label: 'All', icon: Filter },
  { value: 'unread', label: 'Unread', icon: Mail },
  { value: 'read', label: 'Read', icon: MailOpen },
];

export function AlertFilters({ severity, type, read, onSeverityChange, onTypeChange, onReadChange, counts }: AlertFiltersProps) {
  return (
    <div className="card space-y-4 p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="filter-severity" className="mb-1 block text-xs font-medium text-slate-500">Severity</label>
          <select
            id="filter-severity"
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value as SeverityFilter)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {severityOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="filter-type" className="mb-1 block text-xs font-medium text-slate-500">Type</label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {typeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label htmlFor="filter-read" className="mb-1 block text-xs font-medium text-slate-500">Status</label>
          <select
            id="filter-read"
            value={read}
            onChange={(e) => onReadChange(e.target.value as ReadFilter)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {readOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
          {counts.total} total
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-600">
          {counts.unread} unread
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-medium text-green-600">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> {counts.read} read
        </span>
      </div>
    </div>
  );
}
