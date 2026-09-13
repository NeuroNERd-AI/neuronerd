import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Gamepad2, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { GamePerformanceCard } from '@/components/patients/GamePerformanceCard';
import { GamePerformanceTable } from '@/components/patients/GamePerformanceTable';
import { GameSessionDetail } from '@/components/patients/GameSessionDetail';
import { TabBar } from '@/components/patients/TabBar';
import { getGameAnalyticsByPatient, type GameAnalytics } from '@/services/dataService';
import { getPatientById } from '@/services/patientService';
import type { Patient } from '@/types';

type TabId = 'overview' | 'memory_match' | 'object_recall' | 'pattern_sequence';

const gameTabs: { id: TabId; label: string; icon: typeof Gamepad2 }[] = [
  { id: 'overview', label: 'All Games', icon: BarChart3 },
  { id: 'memory_match', label: 'Memory Match', icon: Gamepad2 },
  { id: 'object_recall', label: 'Object Recall', icon: Gamepad2 },
  { id: 'pattern_sequence', label: 'Pattern Sequence', icon: Gamepad2 },
];

function getSessionsForTab(analytics: GameAnalytics[], tab: TabId) {
  if (tab === 'overview') return analytics.flatMap((a) => a.sessions);
  const gameName = gameTabs.find((t) => t.id === tab)?.label;
  return analytics.find((a) => a.gameName === gameName)?.sessions ?? [];
}

export function GameAnalyticsPage() {
  const { patientId = '' } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    getPatientById(patientId).then((result) => {
      if (!mounted) return;
      setPatient(result.data);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const analytics = useMemo(() => getGameAnalyticsByPatient(patientId), [patientId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-5 text-sm text-slate-500">Loading patient...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-5 text-sm text-red-600" role="alert">
          Unable to load this patient: {error}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card">
          <EmptyState title="Patient not found" description="This patient profile is not available." icon={User} />
        </div>
      </div>
    );
  }

  const tabSessions = getSessionsForTab(analytics, activeTab);
  const sortedSessions = [...tabSessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const totalSessions = analytics.reduce((sum, a) => sum + a.sessionsPlayed, 0);
  const totalCompleted = analytics.reduce((sum, a) => sum + a.sessionsCompleted, 0);
  const overallAccuracy = totalSessions > 0
    ? Math.round(analytics.reduce((sum, a) => sum + a.averageAccuracy * a.sessionsPlayed, 0) / totalSessions)
    : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <Link to={`/patients/${patientId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {patient.name}
      </Link>

      <PageHeader
        title="Game Analytics"
        description={`${patient.name} · Cognitive game activity data`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Gamepad2 className="h-5 w-5 text-blue-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Total sessions</p><p className="text-lg font-bold text-slate-900">{totalSessions}</p></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><BarChart3 className="h-5 w-5 text-green-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Sessions completed</p><p className="text-lg font-bold text-slate-900">{totalCompleted}</p></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><BarChart3 className="h-5 w-5 text-teal-600" aria-hidden="true" /></div>
          <div><p className="text-xs text-slate-500">Overall avg. accuracy</p><p className="text-lg font-bold text-slate-900">{overallAccuracy}%</p></div>
        </div>
      </div>

      <div className="mb-6">
        <TabBar tabs={gameTabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as TabId)} />
      </div>

      <div role="tabpanel" tabIndex={0}>
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <GamePerformanceTable analytics={analytics} />
            <div className="grid gap-6 xl:grid-cols-2">
              {analytics.map((game) => (
                <GamePerformanceCard key={game.gameName} analytics={game} />
              ))}
            </div>
            <div className="card">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-slate-900">Recent game sessions</h2>
                <p className="mt-1 text-sm text-slate-500">Latest activity across all games</p>
              </div>
              {sortedSessions.length > 0 ? (
                <div>{sortedSessions.slice(0, 10).map((session) => <GameSessionDetail key={session.id} session={session} />)}</div>
              ) : (
                <EmptyState title="No sessions yet" description="Game session data will appear here once sessions are recorded." icon={Gamepad2} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(() => {
              const gameName = gameTabs.find((t) => t.id === activeTab)?.label;
              const game = analytics.find((a) => a.gameName === gameName);
              if (!game) return <div className="card"><EmptyState title="No data" description="No game data available." icon={Gamepad2} /></div>;
              return (
                <>
                  <GamePerformanceCard analytics={game} />
                  <div className="card">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h2 className="font-semibold text-slate-900">{game.gameName} session history</h2>
                      <p className="mt-1 text-sm text-slate-500">All recorded sessions for this game</p>
                    </div>
                    {sortedSessions.length > 0 ? (
                      <div>{sortedSessions.map((session) => <GameSessionDetail key={session.id} session={session} />)}</div>
                    ) : (
                      <EmptyState title="No sessions recorded" description="Session history will appear here." icon={Gamepad2} />
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Game performance data reflects cognitive game activity only and does not represent a medical diagnosis or clinical assessment.
      </p>
    </div>
  );
}
