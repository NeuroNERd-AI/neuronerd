import { ArrowRight, CheckCircle2, Clock3, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Patient } from '@/types';
import { PatientStatusBadge } from '@/components/ui/StatusBadge';

interface PatientRowProps {
  patient: Patient;
  latestGame?: string;
  reminderStatus: 'all_done' | 'pending' | 'none';
  lastActiveLabel: string;
}

export function PatientRow({ patient, latestGame, reminderStatus, lastActiveLabel }: PatientRowProps) {
  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
      <td className="px-5 py-3.5">
        <Link to={`/patients/${patient.id}`} className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">{patient.name.charAt(0)}</span>
          <span>
            <span className="block text-sm font-semibold text-slate-800 group-hover:text-blue-700">{patient.name}</span>
            <span className="block text-xs text-slate-500">Age {patient.age}</span>
          </span>
        </Link>
      </td>
      <td className="px-5 py-3.5 text-sm text-slate-600">{patient.caregiverName}</td>
      <td className="px-5 py-3.5 text-sm text-slate-600">{lastActiveLabel}</td>
      <td className="px-5 py-3.5">
        {latestGame ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
            <Gamepad2 className="h-4 w-4 text-blue-500" aria-hidden="true" />
            {latestGame}
          </span>
        ) : (
          <span className="text-sm text-slate-400">No recent activity</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        {reminderStatus === 'all_done' ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />All done</span>
        ) : reminderStatus === 'pending' ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-amber-700"><Clock3 className="h-4 w-4" aria-hidden="true" />Pending</span>
        ) : (
          <span className="text-sm text-slate-400">No reminders</span>
        )}
      </td>
      <td className="px-5 py-3.5"><PatientStatusBadge status={patient.status} /></td>
      <td className="px-5 py-3.5 text-right">
        <Link to={`/patients/${patient.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
          View <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </td>
    </tr>
  );
}
