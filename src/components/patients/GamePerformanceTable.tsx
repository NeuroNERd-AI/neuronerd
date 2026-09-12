import { CheckCircle2, Clock3, Gamepad2, XCircle } from 'lucide-react';
import type { GameAnalytics } from '@/services/dataService';

interface GamePerformanceTableProps {
  analytics: GameAnalytics[];
}

export function GamePerformanceTable({ analytics }: GamePerformanceTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-5 py-3">Game</th>
            <th scope="col" className="px-5 py-3 text-right">Sessions</th>
            <th scope="col" className="px-5 py-3 text-right">Completed</th>
            <th scope="col" className="px-5 py-3 text-right">Accuracy</th>
            <th scope="col" className="px-5 py-3 text-right">Attempts</th>
            <th scope="col" className="px-5 py-3 text-right">Avg. time</th>
            <th scope="col" className="px-5 py-3 text-right">Recent score</th>
            <th scope="col" className="px-5 py-3">Last activity</th>
            <th scope="col" className="px-5 py-3">Trend</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((game) => (
            <tr key={game.gameName} className="border-b border-slate-100 transition-colors hover:bg-slate-50 last:border-b-0">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Gamepad2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{game.gameName}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-slate-600">{game.sessionsPlayed}</td>
              <td className="px-5 py-3.5 text-right">
                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                  {game.sessionsCompleted === game.sessionsPlayed && game.sessionsPlayed > 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  )}
                  {game.sessionsCompleted}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right text-sm font-medium text-slate-700">{game.averageAccuracy}%</td>
              <td className="px-5 py-3.5 text-right text-sm text-slate-600">{game.totalAttempts}</td>
              <td className="px-5 py-3.5 text-right text-sm text-slate-600">{game.averageCompletionTime} min</td>
              <td className="px-5 py-3.5 text-right text-sm font-medium text-slate-700">{game.recentScore} pts</td>
              <td className="px-5 py-3.5 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {game.recentActivity}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className="text-xs text-slate-500">{game.trendDescription}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
