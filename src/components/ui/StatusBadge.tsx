import type { PatientStatus, AlertSeverity } from '@/types';

const statusConfig: Record<PatientStatus, { label: string; classes: string }> = {
  stable: { label: 'Stable', classes: 'bg-green-100 text-green-700' },
  needs_attention: {
    label: 'Needs Attention',
    classes: 'bg-amber-100 text-amber-700',
  },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700' },
};

const severityConfig: Record<AlertSeverity, { label: string; classes: string }> = {
  info: { label: 'Info', classes: 'bg-blue-100 text-blue-700' },
  warning: { label: 'Warning', classes: 'bg-amber-100 text-amber-700' },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700' },
};

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  const config = statusConfig[status];
  return <span className={`badge ${config.classes}`}>{config.label}</span>;
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const config = severityConfig[severity];
  return <span className={`badge ${config.classes}`}>{config.label}</span>;
}
