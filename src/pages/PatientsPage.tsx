import { useEffect, useMemo, useState } from 'react';
import { Search, UserPlus, Users, ArrowUpDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { PatientCard } from '@/components/patients/PatientCard';
import { PatientRow } from '@/components/patients/PatientRow';
import {
  getLatestGameSession,
  getPatientReminderStatus,
} from '@/services/dataService';
import { getPatients } from '@/services/patientService';
import type { Patient } from '@/types';
import type { PatientStatus } from '@/types';

type StatusFilter = 'all' | PatientStatus;
type SortKey = 'name' | 'age' | 'lastActive';

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'stable', label: 'Stable' },
  { value: 'needs_attention', label: 'Needs attention' },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'age', label: 'Age' },
  { value: 'lastActive', label: 'Last active' },
];

function formatRelativeDate(value?: string): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  const today = new Date();
  const diffMs = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
}

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');

  useEffect(() => {
    let mounted = true;

    getPatients().then((result) => {
      if (!mounted) return;
      setPatients(result.data);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    const filtered = patients.filter((patient) => {
      const matchesSearch = !lowerSearch || patient.name.toLowerCase().includes(lowerSearch) || (patient.caregiverName ?? '').toLowerCase().includes(lowerSearch);
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'age') return (b.age ?? -1) - (a.age ?? -1);
      return (b.lastActiveAt ?? '').localeCompare(a.lastActiveAt ?? '');
    });

    return sorted;
  }, [patients, search, statusFilter, sortKey]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Patients"
        description="People in your care circle"
        actions={<button className="btn-primary" type="button"><UserPlus className="h-4 w-4" />Add patient</button>}
      />

      <div className="card mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by patient or caregiver name"
              className="input pl-9"
              aria-label="Search patients"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Filter by status</span>
              <select
                className="input cursor-pointer"
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Sort by</span>
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  className="input cursor-pointer pl-9"
                  aria-label="Sort patients"
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as SortKey)}
                >
                  {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            </label>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500" aria-live="polite">
        {loading ? 'Loading patients...' : `${filteredPatients.length} ${filteredPatients.length === 1 ? 'patient' : 'patients'} found`}
      </p>

      {error ? (
        <div className="card p-5 text-sm text-red-600" role="alert">Unable to load patients: {error}</div>
      ) : loading ? (
        <div className="card p-5 text-sm text-slate-500">Loading patients...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="card">
          <EmptyState title="No patients found" description="Try adjusting your search or filters to see results." icon={Users} />
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-5 py-3">Patient</th>
                  <th scope="col" className="px-5 py-3">Caregiver</th>
                  <th scope="col" className="px-5 py-3">Last activity</th>
                  <th scope="col" className="px-5 py-3">Recent game</th>
                  <th scope="col" className="px-5 py-3">Reminders</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    latestGame={getLatestGameSession(patient.id)?.gameName}
                    reminderStatus={getPatientReminderStatus(patient.id)}
                    lastActiveLabel={formatRelativeDate(patient.lastActiveAt)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:hidden">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                latestGame={getLatestGameSession(patient.id)?.gameName}
                reminderStatus={getPatientReminderStatus(patient.id)}
                lastActiveLabel={formatRelativeDate(patient.lastActiveAt)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
