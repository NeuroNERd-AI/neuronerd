import { Bell, CalendarDays, CheckCircle2, Clock3, MoreVertical, Pencil, Power, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Reminder } from '@/types';
import { reminderTypeConfig, formatReminderDateTime, isUpcoming, isToday, isPast } from '@/components/dashboard/ReminderCard';

interface ReminderItemCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export function ReminderItemCard({ reminder, onToggleComplete, onToggleEnabled, onEdit, onDelete }: ReminderItemCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { icon: Icon, classes, label } = reminderTypeConfig[reminder.type];

  const upcoming = isUpcoming(reminder.scheduledFor);
  const today = isToday(reminder.scheduledFor);
  const past = isPast(reminder.scheduledFor);
  const disabled = !reminder.enabled;

  return (
    <article className={`relative flex items-start gap-3 border-b border-slate-100 px-5 py-4 transition-opacity last:border-b-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${classes}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-800">{reminder.title}</h3>
          {reminder.completed && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" aria-label="Completed" />}
          {upcoming && !reminder.completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              <Clock3 className="h-3 w-3" aria-hidden="true" /> Upcoming
            </span>
          )}
          {today && !upcoming && !reminder.completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
              <Bell className="h-3 w-3" aria-hidden="true" /> Today
            </span>
          )}
          {past && !reminder.completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600">
              <Clock3 className="h-3 w-3" aria-hidden="true" /> Overdue
            </span>
          )}
          {disabled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              <Power className="h-3 w-3" aria-hidden="true" /> Disabled
            </span>
          )}
        </div>

        {reminder.description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{reminder.description}</p>}

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">{label}</span>
          <time className="inline-flex items-center gap-1" dateTime={reminder.scheduledFor}>
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatReminderDateTime(reminder.scheduledFor)}
          </time>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onToggleComplete(reminder.id)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            reminder.completed
              ? 'bg-green-50 text-green-700 hover:bg-green-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          aria-label={reminder.completed ? 'Mark as not completed' : 'Mark as completed'}
        >
          {reminder.completed ? 'Completed' : 'Mark done'}
        </button>

        <button
          type="button"
          onClick={() => onToggleEnabled(reminder.id)}
          className={`rounded-lg p-1.5 transition-colors ${
            reminder.enabled ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-amber-500 hover:bg-amber-50'
          }`}
          aria-label={reminder.enabled ? 'Disable reminder' : 'Enable reminder'}
          title={reminder.enabled ? 'Disable' : 'Enable'}
        >
          <Power className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="More actions"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => { onEdit(reminder); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => { onDelete(reminder.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
