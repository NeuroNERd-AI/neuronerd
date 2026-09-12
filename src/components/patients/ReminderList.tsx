import { Bell, CalendarDays, CheckCircle2, Clock3, Droplets } from 'lucide-react';
import type { Reminder } from '@/types';
import { ReminderItemCard } from '@/components/patients/ReminderItemCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { isUpcoming, isToday, isPast } from '@/components/dashboard/ReminderCard';

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

type Section = 'upcoming' | 'today' | 'overdue' | 'completed';

const sectionConfig: Record<Section, { title: string; description: string }> = {
  upcoming: { title: 'Upcoming reminders', description: 'Scheduled for the coming days' },
  today: { title: 'Today', description: 'Reminders scheduled for today' },
  overdue: { title: 'Overdue', description: 'Past due and not yet completed' },
  completed: { title: 'Completed', description: 'Recently completed reminders' },
};

export function ReminderList({ reminders, onToggleComplete, onToggleEnabled, onEdit, onDelete }: ReminderListProps) {
  const enabledReminders = reminders.filter((r) => r.enabled);
  const upcoming = enabledReminders.filter((r) => isUpcoming(r.scheduledFor) && !r.completed);
  const today = enabledReminders.filter((r) => isToday(r.scheduledFor) && !r.completed && !isUpcoming(r.scheduledFor));
  const overdue = enabledReminders.filter((r) => isPast(r.scheduledFor) && !r.completed && !isToday(r.scheduledFor));
  const completed = enabledReminders.filter((r) => r.completed);

  const sections: { key: Section; items: Reminder[] }[] = [
    { key: 'overdue', items: overdue },
    { key: 'today', items: today },
    { key: 'upcoming', items: upcoming },
    { key: 'completed', items: completed },
  ];

  const hasAny = sections.some((s) => s.items.length > 0);

  if (!hasAny) {
    return (
      <div className="card">
        <EmptyState title="No reminders" description="There are no active reminders for this patient yet." icon={Bell} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (section.items.length === 0) return null;
        const { title, description } = sectionConfig[section.key];
        return (
          <div key={section.key} className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {section.items.length}
              </span>
            </div>
            <div>
              {section.items
                .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
                .map((reminder) => (
                  <ReminderItemCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggleComplete={onToggleComplete}
                    onToggleEnabled={onToggleEnabled}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ReminderStats({ reminders }: { reminders: Reminder[] }) {
  const enabled = reminders.filter((r) => r.enabled);
  const total = enabled.length;
  const completedCount = enabled.filter((r) => r.completed).length;
  const upcomingCount = enabled.filter((r) => isUpcoming(r.scheduledFor) && !r.completed).length;
  const todayCount = enabled.filter((r) => isToday(r.scheduledFor) && !r.completed && !isUpcoming(r.scheduledFor)).length;
  const overdueCount = enabled.filter((r) => isPast(r.scheduledFor) && !r.completed && !isToday(r.scheduledFor)).length;
  const disabledCount = reminders.filter((r) => !r.enabled).length;

  const stats = [
    { label: 'Total active', value: total, icon: Bell, classes: 'bg-blue-50 text-blue-600' },
    { label: 'Today', value: todayCount, icon: Clock3, classes: 'bg-amber-50 text-amber-600' },
    { label: 'Upcoming', value: upcomingCount, icon: CalendarDays, classes: 'bg-teal-50 text-teal-600' },
    { label: 'Overdue', value: overdueCount, icon: Clock3, classes: 'bg-rose-50 text-rose-600' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, classes: 'bg-green-50 text-green-600' },
    { label: 'Disabled', value: disabledCount, icon: Droplets, classes: 'bg-slate-100 text-slate-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card flex items-center gap-3 p-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.classes}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
