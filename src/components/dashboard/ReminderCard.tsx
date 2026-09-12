import { Bell, CalendarDays, CheckCircle2, Droplets, Dumbbell, Pill, UserCog } from 'lucide-react';
import type { Reminder, ReminderType } from '@/types';

interface ReminderCardProps {
  reminder: Reminder;
  patientName: string;
}

export const reminderTypeConfig: Record<ReminderType, { icon: typeof Pill; classes: string; label: string }> = {
  medication: { icon: Pill, classes: 'bg-blue-50 text-blue-600', label: 'Medication' },
  hydration: { icon: Droplets, classes: 'bg-cyan-50 text-cyan-600', label: 'Hydration' },
  daily_activity: { icon: Dumbbell, classes: 'bg-green-50 text-green-600', label: 'Daily Activity' },
  appointment: { icon: CalendarDays, classes: 'bg-amber-50 text-amber-600', label: 'Appointment' },
  custom: { icon: UserCog, classes: 'bg-teal-50 text-teal-600', label: 'Custom' },
};

export function formatReminderTime(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function formatReminderDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export function formatReminderDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value));
}

export function isUpcoming(scheduledFor: string): boolean {
  const now = new Date('2026-09-08T23:59:59Z');
  const scheduled = new Date(scheduledFor);
  return scheduled.getTime() > now.getTime();
}

export function isToday(scheduledFor: string): boolean {
  return scheduledFor.startsWith('2026-09-08');
}

export function isPast(scheduledFor: string): boolean {
  const now = new Date('2026-09-08T23:59:59Z');
  const scheduled = new Date(scheduledFor);
  return scheduled.getTime() < now.getTime();
}

export function ReminderCard({ reminder, patientName }: ReminderCardProps) {
  const { icon: Icon, classes } = reminderTypeConfig[reminder.type];
  return (
    <article className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${classes}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-800">{reminder.title}</h3>
          {reminder.completed && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" aria-label="Completed" />}
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500">{patientName}</p>
      </div>
      <time className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500" dateTime={reminder.scheduledFor}>
        <Bell className="h-3.5 w-3.5" aria-hidden="true" />
        {formatReminderTime(reminder.scheduledFor)}
      </time>
    </article>
  );
}
