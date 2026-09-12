import { CheckCircle2, Clock3, Gamepad2, RotateCcw, Target, XCircle } from 'lucide-react';
import type { GameSession } from '@/types';

interface GameSessionDetailProps {
  session: GameSession;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function GameSessionDetail({ session }: GameSessionDetailProps) {
  return (
    <article className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Gamepad2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-800">{session.gameName}</h3>
          {session.completed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" aria-label="Completed" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-amber-500" aria-label="Not completed" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(session.completedAt)}</p>
      </div>
      <div className="hidden shrink-0 items-center gap-4 sm:flex">
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {session.attempts} attempts
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {session.durationMinutes} min
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          <Target className="mr-1 inline h-3 w-3" aria-hidden="true" />{session.accuracy}%
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{session.score} pts</span>
      </div>
    </article>
  );
}
