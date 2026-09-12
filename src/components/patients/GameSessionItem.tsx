import { Gamepad2 } from 'lucide-react';
import type { GameSession } from '@/types';

interface GameSessionItemProps {
  session: GameSession;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function GameSessionItem({ session }: GameSessionItemProps) {
  return (
    <article className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Gamepad2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800">{session.gameName}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{formatDate(session.completedAt)} · {session.durationMinutes} min</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">{session.accuracy}% accuracy</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{session.score} pts</span>
      </div>
    </article>
  );
}
