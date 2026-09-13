import { CheckCircle2, Clock3, Gamepad2, Target, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { GameAnalytics } from '@/services/gameService';
import { PerformanceTrendChart } from '@/components/patients/PerformanceTrendChart';

interface GamePerformanceCardProps {
  analytics: GameAnalytics;
}

const trendConfig = {
  improved: { icon: TrendingUp, classes: 'bg-green-50 text-green-700', label: 'Improved' },
  stable: { icon: Minus, classes: 'bg-slate-50 text-slate-600', label: 'Stable' },
  changed: { icon: TrendingDown, classes: 'bg-amber-50 text-amber-700', label: 'Changed' },
};

export function GamePerformanceCard({ analytics }: GamePerformanceCardProps) {
  const { icon: TrendIcon, classes: trendClasses, label: trendLabel } = trendConfig[analytics.trend];

  return (
    <article className="card overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Gamepad2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{analytics.gameName}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{analytics.recentActivity}</p>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trendClasses}`}>
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" /> {trendLabel}
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm text-slate-600">{analytics.trendDescription}</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Sessions played</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.sessionsPlayed}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.sessionsCompleted}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Avg. accuracy</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.averageAccuracy}%</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Total attempts</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.totalAttempts}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Avg. completion time</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.averageCompletionTime} min</p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Recent score</p>
          <p className="mt-0.5 text-lg font-bold text-slate-900">{analytics.recentScore} pts</p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Target className="h-3.5 w-3.5" aria-hidden="true" /> Performance trend
        </div>
        {analytics.sessions.length > 0 ? (
          <PerformanceTrendChart sessions={analytics.sessions} gameName={analytics.gameName} metrics={['accuracy', 'score']} />
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No session data available</p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" />Accuracy</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />Score</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Last activity: {analytics.recentActivity}</span>
        {analytics.sessionsCompleted === analytics.sessionsPlayed && analytics.sessionsPlayed > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> All sessions completed
          </span>
        )}
      </div>
    </article>
  );
}
