import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Gamepad2,
  ListPlus,
  Users,
} from 'lucide-react';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ReminderCard } from '@/components/dashboard/ReminderCard';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { PatientStatusBadge } from '@/components/ui/StatusBadge';
import { mockAlerts, mockCurrentUser, mockGameSessions, mockPatients } from '@/data/mockData';
import {
  getDailyActivity,
  getPatientsNeedingAttention,
  getPatientById,
  getTodayGameSessions,
  getTodayReminders,
} from '@/services/dataService';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value));
}

export function DashboardPage() {
  const todaySessions = getTodayGameSessions();
  const todayReminders = getTodayReminders();
  const patientsNeedingAttention = getPatientsNeedingAttention();
  const dailyActivity = getDailyActivity();
  const recentSessions = [...mockGameSessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 5);
  const activePatientIds = new Set(todaySessions.map((session) => session.patientId));
  const completedReminders = todayReminders.filter((reminder) => reminder.completed).length;
  const engagedPercentage = Math.round((activePatientIds.size / mockPatients.length) * 100);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Good morning, ${mockCurrentUser.name.split(' ')[0]}`}
        description="Here is how your care circle is doing today."
        actions={<span className="hidden text-sm text-slate-500 sm:block">Tuesday, September 8, 2026</span>}
      />

      <section aria-labelledby="overview-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="overview-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">Today at a glance</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total patients" value={mockPatients.length} detail="People in your care circle" icon={Users} tone="blue" />
          <SummaryCard label="Active patients" value={activePatientIds.size} detail="Engaged with activities today" icon={Activity} tone="green" />
          <SummaryCard label="Sessions completed today" value={todaySessions.length} detail="Game sessions completed" icon={Gamepad2} tone="teal" />
          <SummaryCard label="Reminders due today" value={todayReminders.length - completedReminders} detail={`${completedReminders} completed so far`} icon={Clock3} tone="amber" />
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <ActivityChart data={dailyActivity} />

        <section className="card overflow-hidden" aria-labelledby="attention-heading">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 id="attention-heading" className="font-semibold text-slate-900">Patients needing attention</h2>
              <p className="mt-1 text-sm text-slate-500">Follow up on these care items</p>
            </div>
            <Link to="/patients" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {patientsNeedingAttention.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {patientsNeedingAttention.map((patient) => (
                <Link key={patient.id} to={`/patients/${patient.id}`} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 font-semibold text-amber-700">{patient.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{patient.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{patient.notes || 'Review recent activity'}</p></div>
                  <PatientStatusBadge status={patient.status} />
                </Link>
              ))}
            </div>
          ) : <EmptyState title="Everyone is on track" description="There are no patient follow-ups waiting right now." icon={CheckCircle2} />}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card overflow-hidden" aria-labelledby="reminders-heading">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div><h2 id="reminders-heading" className="font-semibold text-slate-900">Today&apos;s scheduled reminders</h2><p className="mt-1 text-sm text-slate-500">Keep daily routines on track</p></div>
            <Link to="/patients" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">Manage <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          {todayReminders.length > 0 ? <div>{todayReminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} patientName={getPatientById(reminder.patientId)?.name || 'Patient'} />)}</div> : <EmptyState title="No reminders scheduled" description="There are no reminders planned for today." icon={Bell} />}
        </section>

        <section className="card overflow-hidden" aria-labelledby="participation-heading">
          <div className="border-b border-slate-100 px-5 py-4"><h2 id="participation-heading" className="font-semibold text-slate-900">Game participation</h2><p className="mt-1 text-sm text-slate-500">Engagement across your care circle</p></div>
          <div className="space-y-5 px-5 py-5">
            <div className="flex items-end justify-between gap-4"><div><p className="text-3xl font-bold text-slate-900">{engagedPercentage}%</p><p className="mt-1 text-sm text-slate-500">of patients played today</p></div><div className="rounded-lg bg-teal-50 px-3 py-2 text-right"><p className="text-lg font-bold text-teal-700">{todaySessions.length}</p><p className="text-xs text-teal-700">sessions</p></div></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${engagedPercentage}%` }} /></div>
            <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Recent sessions</p><p className="mt-1 font-semibold text-slate-800">{mockGameSessions.length} total</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Most played</p><p className="mt-1 font-semibold text-slate-800">Picture Pairs</p></div></div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="card overflow-hidden" aria-labelledby="activity-heading">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 id="activity-heading" className="font-semibold text-slate-900">Recent cognitive activity</h2><p className="mt-1 text-sm text-slate-500">Latest game results and engagement</p></div><Link to="/patients" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View activity <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          <div className="divide-y divide-slate-100">
            {recentSessions.map((session) => <div key={session.id} className="flex items-center gap-3 px-5 py-3.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50"><Gamepad2 className="h-4 w-4 text-blue-600" aria-hidden="true" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{session.gameName}</p><p className="mt-0.5 truncate text-xs text-slate-500">{getPatientById(session.patientId)?.name || 'Patient'} · {formatDate(session.completedAt)}</p></div><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{session.accuracy}% accuracy</p><p className="mt-0.5 text-xs text-slate-500">{session.durationMinutes} min</p></div><span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">{session.score} pts</span></div>)}
          </div>
        </section>

        <section className="card overflow-hidden" aria-labelledby="alerts-heading">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 id="alerts-heading" className="font-semibold text-slate-900">Recent alerts</h2><p className="mt-1 text-sm text-slate-500">Updates that may need your attention</p></div><Link to="/alerts" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          {mockAlerts.length > 0 ? <div>{mockAlerts.slice(0, 3).map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div> : <EmptyState title="No recent alerts" description="You are all caught up for now." icon={CheckCircle2} />}
        </section>
      </div>

      <section className="mt-6" aria-labelledby="quick-actions-heading">
        <div className="mb-3 flex items-center justify-between"><h2 id="quick-actions-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick actions</h2></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/patients" className="card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Users className="h-5 w-5 text-blue-600" aria-hidden="true" /></div><div className="flex-1"><p className="text-sm font-semibold text-slate-800">View patients</p><p className="mt-0.5 text-xs text-slate-500">Open the care circle</p></div><ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
          <Link to="/alerts" className="card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"><Bell className="h-5 w-5 text-amber-600" aria-hidden="true" /></div><div className="flex-1"><p className="text-sm font-semibold text-slate-800">Review alerts</p><p className="mt-0.5 text-xs text-slate-500">Check recent updates</p></div><ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
          <Link to="/patients" className="card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><ListPlus className="h-5 w-5 text-teal-600" aria-hidden="true" /></div><div className="flex-1"><p className="text-sm font-semibold text-slate-800">Plan a reminder</p><p className="mt-0.5 text-xs text-slate-500">Keep routines organized</p></div><ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
