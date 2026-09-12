import {
  Bell,
  BookHeart,
  CheckCircle2,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'game' | 'reminder' | 'memory' | 'alert';
  title: string;
  description: string;
  timestamp: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<TimelineEvent['type'], { icon: LucideIcon; classes: string }> = {
  game: { icon: Gamepad2, classes: 'bg-blue-50 text-blue-600' },
  reminder: { icon: Bell, classes: 'bg-amber-50 text-amber-600' },
  memory: { icon: BookHeart, classes: 'bg-teal-50 text-teal-600' },
  alert: { icon: CheckCircle2, classes: 'bg-green-50 text-green-600' },
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) return null;
  return (
    <ol className="relative space-y-5 before:absolute before:left-[18px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200">
      {events.map((event) => {
        const { icon: Icon, classes } = eventConfig[event.type];
        return (
          <li key={event.id} className="relative flex gap-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${classes}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-slate-800">{event.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{event.description}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDateTime(event.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
