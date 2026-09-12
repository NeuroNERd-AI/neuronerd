import { ArrowRight, Bell, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Alert } from '@/types';
import { SeverityBadge } from '@/components/ui/StatusBadge';

interface AlertCardProps {
  alert: Alert;
}

const iconConfig = {
  info: { icon: Info, classes: 'bg-blue-50 text-blue-600' },
  warning: { icon: TriangleAlert, classes: 'bg-amber-50 text-amber-600' },
  critical: { icon: Bell, classes: 'bg-red-50 text-red-600' },
};

export function AlertCard({ alert }: AlertCardProps) {
  const { icon: Icon, classes } = iconConfig[alert.severity];
  return (
    <article className="flex gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${classes}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{alert.title}</h3>
          <SeverityBadge severity={alert.severity} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">For {alert.patientName}</span>
          {alert.patientId && (
            <Link to={`/patients/${alert.patientId}`} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
              View patient <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      {alert.read && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" aria-label="Read" />}
    </article>
  );
}
