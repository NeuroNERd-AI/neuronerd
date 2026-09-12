import { useEffect, useState } from 'react';
import { CalendarDays, Droplets, Dumbbell, Pill, UserCog, X } from 'lucide-react';
import type { Reminder, ReminderType } from '@/types';

export interface ReminderFormData {
  type: ReminderType;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  enabled: boolean;
}

interface ReminderFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: Reminder | null;
  onClose: () => void;
  onSubmit: (data: ReminderFormData) => void;
}

const typeOptions: { value: ReminderType; label: string; icon: typeof Pill; classes: string }[] = [
  { value: 'medication', label: 'Medication', icon: Pill, classes: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'hydration', label: 'Hydration', icon: Droplets, classes: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { value: 'daily_activity', label: 'Daily Activity', icon: Dumbbell, classes: 'bg-green-50 text-green-600 border-green-200' },
  { value: 'appointment', label: 'Appointment', icon: CalendarDays, classes: 'bg-amber-50 text-amber-600 border-amber-200' },
  { value: 'custom', label: 'Custom', icon: UserCog, classes: 'bg-teal-50 text-teal-600 border-teal-200' },
];

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

function toTimeInput(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function ReminderFormDialog({ open, mode, initialData, onClose, onSubmit }: ReminderFormDialogProps) {
  const [type, setType] = useState<ReminderType>('medication');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-09-09');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setType(initialData.type);
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setScheduledDate(toDateInput(initialData.scheduledFor));
        setScheduledTime(toTimeInput(initialData.scheduledFor));
        setEnabled(initialData.enabled);
      } else {
        setType('medication');
        setTitle('');
        setDescription('');
        setScheduledDate('2026-09-09');
        setScheduledTime('09:00');
        setEnabled(true);
      }
      setError('');
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a reminder title.');
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      setError('Please select a date and time.');
      return;
    }
    onSubmit({
      type,
      title: title.trim(),
      description: description.trim(),
      scheduledDate,
      scheduledTime,
      enabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="reminder-dialog-title">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="reminder-dialog-title" className="text-lg font-semibold text-slate-900">
            {mode === 'add' ? 'Add reminder' : 'Edit reminder'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Close dialog">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {typeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? `${option.classes} ring-2 ring-blue-500/20`
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="reminder-title" className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
            <input
              id="reminder-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning medication"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="reminder-description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="reminder-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details or instructions"
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              maxLength={200}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reminder-date" className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
              <input
                id="reminder-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="reminder-time" className="mb-1.5 block text-sm font-medium text-slate-700">Time</label>
              <input
                id="reminder-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-slate-700">Reminder enabled</span>
          </label>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">{error}</p>}

          {type === 'medication' && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-700">
              This app does not prescribe medication or adjust dosages. Please enter medication details as instructed by the patient's healthcare provider.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {mode === 'add' ? 'Add reminder' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
