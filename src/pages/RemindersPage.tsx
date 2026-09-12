import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Plus, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ReminderList, ReminderStats } from '@/components/patients/ReminderList';
import { ReminderFormDialog, type ReminderFormData } from '@/components/patients/ReminderFormDialog';
import { TabBar } from '@/components/patients/TabBar';
import { getPatientById } from '@/services/dataService';
import { mockReminders } from '@/data/mockData';
import type { Reminder } from '@/types';

type TabId = 'all' | 'medication' | 'hydration' | 'daily_activity' | 'appointment' | 'custom';

const filterTabs: { id: TabId; label: string; icon: typeof Bell }[] = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'medication', label: 'Medication', icon: Bell },
  { id: 'hydration', label: 'Hydration', icon: Bell },
  { id: 'daily_activity', label: 'Daily Activity', icon: Bell },
  { id: 'appointment', label: 'Appointments', icon: Bell },
  { id: 'custom', label: 'Custom', icon: Bell },
];

function buildIsoDate(date: string, time: string): string {
  return `${date}T${time}:00Z`;
}

function generateId(): string {
  return `r-${Date.now()}`;
}

export function RemindersPage() {
  const { patientId = '' } = useParams();
  const patient = getPatientById(patientId);

  const [reminders, setReminders] = useState<Reminder[]>(() =>
    mockReminders.filter((r) => r.patientId === patientId)
  );
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const filteredReminders = useMemo(() => {
    if (activeTab === 'all') return reminders;
    return reminders.filter((r) => r.type === activeTab);
  }, [reminders, activeTab]);

  if (!patient) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card">
          <EmptyState title="Patient not found" description="This patient profile is not available in the prototype." icon={User} />
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingReminder(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleToggleEnabled = (id: string) => {
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleSubmit = (data: ReminderFormData) => {
    const scheduledFor = buildIsoDate(data.scheduledDate, data.scheduledTime);
    if (dialogMode === 'add') {
      const newReminder: Reminder = {
        id: generateId(),
        patientId,
        type: data.type,
        title: data.title,
        description: data.description || undefined,
        scheduledFor,
        completed: false,
        enabled: data.enabled,
      };
      setReminders((prev) => [...prev, newReminder]);
    } else if (editingReminder) {
      setReminders((prev) => prev.map((r) => r.id === editingReminder.id ? {
        ...r,
        type: data.type,
        title: data.title,
        description: data.description || undefined,
        scheduledFor,
        enabled: data.enabled,
      } : r));
    }
    setDialogOpen(false);
    setEditingReminder(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Link to={`/patients/${patientId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {patient.name}
      </Link>

      <PageHeader
        title="Reminders"
        description={`${patient.name} · Care reminders and daily routines`}
        actions={
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add reminder
          </button>
        }
      />

      <div className="mb-6">
        <ReminderStats reminders={reminders} />
      </div>

      <div className="mb-6">
        <TabBar tabs={filterTabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as TabId)} />
      </div>

      <ReminderList
        reminders={filteredReminders}
        onToggleComplete={handleToggleComplete}
        onToggleEnabled={handleToggleEnabled}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <p className="mt-6 text-xs text-slate-400">
        Reminders are managed by caregivers. This application does not prescribe medication or modify medication dosage.
      </p>

      <ReminderFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={editingReminder}
        onClose={() => { setDialogOpen(false); setEditingReminder(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
