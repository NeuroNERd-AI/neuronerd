import { CalendarDays, Eye, Heart, Home, Image, Repeat, User } from 'lucide-react';
import type { MemoryCategory, MemoryEntry } from '@/types';

interface MemoryCardProps {
  memory: MemoryEntry;
  onClick?: (memory: MemoryEntry) => void;
}

export const memoryCategoryConfig: Record<MemoryCategory, { icon: typeof Heart; classes: string; label: string }> = {
  person: { icon: User, classes: 'bg-rose-50 text-rose-600', label: 'Important Person' },
  place: { icon: Home, classes: 'bg-teal-50 text-teal-600', label: 'Familiar Place' },
  object: { icon: Image, classes: 'bg-amber-50 text-amber-600', label: 'Important Object' },
  memory: { icon: Heart, classes: 'bg-blue-50 text-blue-600', label: 'Personal Memory' },
  routine: { icon: Repeat, classes: 'bg-green-50 text-green-600', label: 'Daily Routine' },
};

export function formatMemoryDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const { icon: Icon, classes, label } = memoryCategoryConfig[memory.category];
  const interactive = !!onClick;

  return (
    <article
      className={`card overflow-hidden transition-all ${interactive ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''} ${!memory.active ? 'opacity-60' : ''}`}
      onClick={interactive ? () => onClick?.(memory) : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(memory); } } : undefined}
    >
      {memory.imageUrl ? (
        <div className="aspect-[3/2] w-full overflow-hidden bg-slate-100">
          <img src={memory.imageUrl} alt={memory.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className={`flex aspect-[3/2] w-full items-center justify-center ${classes}`}>
          <Icon className="h-10 w-10 opacity-40" aria-hidden="true" />
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}>
            <Icon className="h-3 w-3" aria-hidden="true" /> {label}
          </span>
          {!memory.active && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Inactive</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{memory.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{memory.description}</p>
        {memory.context && <p className="mt-2 text-xs font-medium text-slate-500">{memory.context}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatMemoryDate(memory.recordedAt)}
          </span>
          {memory.lastReviewedAt && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Reviewed {formatMemoryDate(memory.lastReviewedAt)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
