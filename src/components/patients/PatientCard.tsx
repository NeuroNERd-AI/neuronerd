import { ArrowRight, CheckCircle2, Clock3, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Patient } from '@/types';
import { PatientStatusBadge } from '@/components/ui/StatusBadge';

interface PatientCardProps {
  patient: Patient;
  latestGame?: string;
  reminderStatus: 'all_done' | 'pending' | 'none';
  lastActiveLabel: string;
}

export function PatientCard({ patient, latestGame, reminderStatus, lastActiveLabel }: PatientCardProps) {
  return (
    <Link to={`/patients/${patient.id}`} className="card group block p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-700">{patient.name.charAt(0)}</span>
          <div>
            <h2 className="font-semibold text-slate-900 group-hover:text-blue-700">{patient.name}</h2>
            <p className="text-sm text-slate-500">
              {patient.age !== undefined ? `Age ${patient.age}` : 'Age not recorded'}
            </p>
          </div>
        </div>
        <PatientStatusBadge status={patient.status} />
      </div>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">Caregiver</dt>
          <dd className="truncate font-medium text-slate-700">{patient.caregiverName}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">Last activity</dt>
          <dd className="font-medium text-slate-700">{lastActiveLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">Recent game</dt>
          <dd className="flex min-w-0 items-center gap-1.5">
            {latestGame ? (
              <>
                <Gamepad2 className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                <span className="truncate font-medium text-slate-700">{latestGame}</span>
              </>
            ) : (
              <span className="text-slate-400">No recent activity</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-500">Reminders</dt>
          <dd>
            {reminderStatus === 'all_done' ? (
              <span className="inline-flex items-center gap-1.5 text-green-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />All done</span>
            ) : reminderStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1.5 text-amber-700"><Clock3 className="h-4 w-4" aria-hidden="true" />Pending</span>
            ) : (
              <span className="text-slate-400">No reminders</span>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">Tap to view full profile</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
          View <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
