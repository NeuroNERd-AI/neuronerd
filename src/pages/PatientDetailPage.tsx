import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Bell,
  BookHeart,
  CheckCircle2,
  Clock3,
  Gamepad2,
  Globe,
  History,
  ListChecks,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PatientStatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { ReminderCard } from '@/components/dashboard/ReminderCard';
import { GameSessionItem } from '@/components/patients/GameSessionItem';
import { MemoryCard } from '@/components/patients/MemoryCard';
import { PerformanceTrendChart } from '@/components/patients/PerformanceTrendChart';
import { TabBar } from '@/components/patients/TabBar';
import { Timeline, type TimelineEvent } from '@/components/patients/Timeline';
import {
  getAlertsByPatient,
  getMemoriesByPatient,
  getRemindersByPatient,
} from '@/services/dataService';
import { getGameSessionsByPatient } from '@/services/gameService';
import { getPatientById } from '@/services/patientService';
import type { GameSession, Patient } from '@/types';

type TabId = 'overview' | 'activity' | 'games' | 'reminders' | 'memories' | 'alerts' | 'timeline';

const tabs: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'activity', label: 'Recent Activity', icon: Activity },
  { id: 'games', label: 'Game Performance', icon: Gamepad2 },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'memories', label: 'Memory Assistance', icon: BookHeart },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'timeline', label: 'Timeline', icon: History },
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

export function PatientDetailPage() {
  const { patientId = '' } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setSessionsLoading(true);

    getPatientById(patientId).then((result) => {
      if (!mounted) return;
      setPatient(result.data);
      setError(result.error);
      setLoading(false);
    });

    getGameSessionsByPatient(patientId).then((result) => {
      if (!mounted) return;
      setSessions(result.data);
      setSessionsError(result.error);
      setSessionsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const reminders = useMemo(() => patient ? getRemindersByPatient(patientId) : [], [patientId, patient]);
  const memories = useMemo(() => patient ? getMemoriesByPatient(patientId) : [], [patientId, patient]);
  const alerts = useMemo(() => patient ? getAlertsByPatient(patientId) : [], [patientId, patient]);
  const uniqueGames = useMemo(() => [...new Set(sessions.map((s) => s.gameName))], [sessions]);

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    if (!patient) return [];
    const gameEvents: TimelineEvent[] = sessions.map((s) => ({ id: s.id, type: 'game', title: `Played ${s.gameName}`, description: `${s.accuracy}% accuracy · ${s.score} points · ${s.durationMinutes} min`, timestamp: s.completedAt }));
    const reminderEvents: TimelineEvent[] = reminders.map((r) => ({ id: r.id, type: 'reminder', title: r.completed ? `Completed: ${r.title}` : `Scheduled: ${r.title}`, description: r.description || 'No additional details', timestamp: r.scheduledFor }));
    const memoryEvents: TimelineEvent[] = memories.map((m) => ({ id: m.id, type: 'memory', title: `Memory recorded: ${m.title}`, description: m.description, timestamp: m.recordedAt }));
    const alertEvents: TimelineEvent[] = alerts.map((a) => ({ id: a.id, type: 'alert', title: a.title, description: a.message, timestamp: a.createdAt }));
    return [...gameEvents, ...reminderEvents, ...memoryEvents, ...alertEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 12);
  }, [patient, sessions, reminders, memories, alerts]);

  if (loading || sessionsLoading) {
    return <div className="mx-auto max-w-4xl"><div className="card p-5 text-sm text-slate-500">Loading patient...</div></div>;
  }

  if (error) {
    return <div className="mx-auto max-w-4xl"><div className="card p-5 text-sm text-red-600" role="alert">Unable to load this patient: {error}</div></div>;
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card">
          <EmptyState title="Patient not found" description="This patient profile is not available in the prototype." icon={User} />
        </div>
      </div>
    );
  }

  const recentSessions = [...sessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 5);
  const upcomingReminders = reminders.filter((r) => !r.completed).sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  const avgAccuracy = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length) : 0;
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length) : 0;
  const totalDuration = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="mx-auto max-w-7xl">
      <Link to="/patients" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to patients
      </Link>

      <PageHeader
        title={patient.name}
        description={`Patient profile${patient.age !== undefined ? ` · Age ${patient.age}` : ''}`}
        actions={<PatientStatusBadge status={patient.status} />}
      />

      {sessionsError && (
        <div className="mb-6 card p-4 text-sm text-amber-700 bg-amber-50" role="alert">
          Unable to load game performance data: {sessionsError}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><User className="h-5 w-5 text-blue-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Age</p><p className="text-sm font-semibold text-slate-900">{patient.age !== undefined ? `${patient.age} years` : 'Not available'}</p></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><Globe className="h-5 w-5 text-teal-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Preferred language</p><p className="text-sm font-semibold text-slate-900">{patient.preferredLanguage || 'Not available'}</p></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"><Clock3 className="h-5 w-5 text-amber-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Last active</p><p className="text-sm font-semibold text-slate-900">{formatRelativeDate(patient.lastActiveAt)}</p></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><Users className="h-5 w-5 text-green-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Caregiver</p><p className="truncate text-sm font-semibold text-slate-900">{patient.caregiverName || 'Not available'}</p></div>
        </div>
      </div>

      <div className="mb-6">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as TabId)} />
      </div>

      <div role="tabpanel" tabIndex={0}>
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Care notes</h2><p className="mt-1 text-sm text-slate-500">Context shared by the care team</p></div>
              <div className="px-5 py-4"><p className="text-sm leading-6 text-slate-600">{patient.notes || 'No care notes have been added yet.'}</p></div>
            </div>
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Quick stats</h2></div>
              <div className="space-y-3 px-5 py-4">
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Total sessions</span><span className="text-sm font-semibold text-slate-800">{sessions.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Games played</span><span className="text-sm font-semibold text-slate-800">{uniqueGames.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Avg. accuracy</span><span className="text-sm font-semibold text-slate-800">{avgAccuracy}%</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Avg. score</span><span className="text-sm font-semibold text-slate-800">{avgScore} pts</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Total time</span><span className="text-sm font-semibold text-slate-800">{totalDuration} min</span></div>
              </div>
            </div>
            {recentSessions.length > 0 && (
              <div className="card lg:col-span-3">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Recent sessions</h2><p className="mt-1 text-sm text-slate-500">Latest game activity</p></div><button type="button" onClick={() => setActiveTab('activity')} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View all <Activity className="h-4 w-4" aria-hidden="true" /></button></div>
                <div>{recentSessions.map((session) => <GameSessionItem key={session.id} session={session} />)}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Recent activity</h2><p className="mt-1 text-sm text-slate-500">Game sessions and engagement data</p></div>
              {recentSessions.length > 0 ? <div>{recentSessions.map((session) => <GameSessionItem key={session.id} session={session} />)}</div> : <EmptyState title="No recent activity" description="There are no game sessions recorded yet." icon={Activity} />}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Gamepad2 className="h-5 w-5 text-blue-600" aria-hidden="true" /></div><div><p className="text-xs text-slate-500">Sessions this week</p><p className="text-lg font-bold text-slate-900">{sessions.length}</p></div></div>
              <div className="card flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><Target className="h-5 w-5 text-teal-600" aria-hidden="true" /></div><div><p className="text-xs text-slate-500">Avg. accuracy</p><p className="text-lg font-bold text-slate-900">{avgAccuracy}%</p></div></div>
              <div className="card flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"><Clock3 className="h-5 w-5 text-amber-600" aria-hidden="true" /></div><div><p className="text-xs text-slate-500">Total time</p><p className="text-lg font-bold text-slate-900">{totalDuration} min</p></div></div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Performance trends</h2><p className="mt-1 text-sm text-slate-500">Accuracy and score across recent game sessions</p></div><span className="badge bg-blue-50 text-blue-700"><TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> Activity data</span></div>
              <div className="px-5 py-5">
                {sessions.length > 0 ? <PerformanceTrendChart sessions={sessions} /> : <EmptyState title="No game data" description="Game performance data will appear here once sessions are recorded." icon={Gamepad2} />}
              </div>
              <div className="flex flex-wrap gap-4 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" />Accuracy</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />Score</span>
              </div>
            </div>
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Games played</h2><p className="mt-1 text-sm text-slate-500">Unique games this patient has engaged with</p></div>
              {uniqueGames.length > 0 ? <div className="flex flex-wrap gap-2 px-5 py-4">{uniqueGames.map((game) => <span key={game} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"><Gamepad2 className="h-4 w-4 text-blue-500" aria-hidden="true" />{game}</span>)}</div> : <EmptyState title="No games played" description="This patient has not yet engaged with any games." icon={Gamepad2} />}
            </div>
            <div className="card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">All game sessions</h2><p className="mt-1 text-sm text-slate-500">Complete game activity history</p></div><Link to={`/patients/${patientId}/games/analytics`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">Game analytics <TrendingUp className="h-4 w-4" aria-hidden="true" /></Link></div>
              {sessions.length > 0 ? <div>{[...sessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).map((session) => <GameSessionItem key={session.id} session={session} />)}</div> : <EmptyState title="No sessions recorded" description="Game session data will appear here." icon={Gamepad2} />}
            </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Upcoming reminders</h2><p className="mt-1 text-sm text-slate-500">Scheduled reminders that need attention</p></div><Link to={`/patients/${patientId}/reminders/manage`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">Manage reminders <Bell className="h-4 w-4" aria-hidden="true" /></Link></div>
              {upcomingReminders.length > 0 ? <div>{upcomingReminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} patientName={patient.name} />)}</div> : <EmptyState title="All caught up" description="There are no pending reminders for this patient." icon={CheckCircle2} />}
            </div>
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Completed reminders</h2><p className="mt-1 text-sm text-slate-500">Recently completed routine items</p></div>
              {reminders.filter((r) => r.completed).length > 0 ? <div>{reminders.filter((r) => r.completed).map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} patientName={patient.name} />)}</div> : <EmptyState title="No completed reminders" description="Completed reminders will appear here." icon={ListChecks} />}
            </div>
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Memory assistance</h2><p className="mt-1 text-sm text-slate-500">Personal memories and moments shared with the care circle</p></div><Link to={`/patients/${patientId}/memories/manage`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">Manage memories <BookHeart className="h-4 w-4" aria-hidden="true" /></Link></div>
              {memories.length > 0 ? <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">{memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)}</div> : <EmptyState title="No memories yet" description="Shared memories will appear here as they are recorded." icon={BookHeart} />}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Alerts for this patient</h2><p className="mt-1 text-sm text-slate-500">Updates and notifications that may need attention</p></div>
              {alerts.length > 0 ? <div>{alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div> : <EmptyState title="No alerts" description="There are no alerts for this patient right now." icon={Bell} />}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Activity timeline</h2><p className="mt-1 text-sm text-slate-500">A chronological view of recent events and updates</p></div>
              <div className="px-5 py-6">
                {timelineEvents.length > 0 ? <Timeline events={timelineEvents} /> : <EmptyState title="No events yet" description="Activity timeline events will appear here." icon={History} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
