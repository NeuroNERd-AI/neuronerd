import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookHeart, Eye, Heart, Home, Image, Plus, Repeat, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { MemoryList } from '@/components/patients/MemoryList';
import { MemoryDetail } from '@/components/patients/MemoryDetail';
import { MemoryFormDialog, type MemoryFormData } from '@/components/patients/MemoryFormDialog';
import { TabBar } from '@/components/patients/TabBar';
import { getPatientById } from '@/services/patientService';
import { mockMemories } from '@/data/mockData';
import type { MemoryCategory, MemoryEntry, Patient } from '@/types';

type TabId = 'all' | 'person' | 'place' | 'object' | 'memory' | 'routine' | 'inactive';

const filterTabs: { id: TabId; label: string; icon: typeof Heart }[] = [
  { id: 'all', label: 'All', icon: BookHeart },
  { id: 'person', label: 'People', icon: User },
  { id: 'place', label: 'Places', icon: Home },
  { id: 'object', label: 'Objects', icon: Image },
  { id: 'memory', label: 'Memories', icon: Heart },
  { id: 'routine', label: 'Routines', icon: Repeat },
  { id: 'inactive', label: 'Inactive', icon: Eye },
];

function generateId(): string {
  return `m-${Date.now()}`;
}

const categoryCounts = (memories: MemoryEntry[]): { category: MemoryCategory; count: number }[] => {
  const categories: MemoryCategory[] = ['person', 'place', 'object', 'memory', 'routine'];
  return categories.map((category) => ({
    category,
    count: memories.filter((m) => m.category === category).length,
  }));
};

const categoryIconClasses: Record<MemoryCategory, { classes: string; icon: typeof Heart; label: string }> = {
  person: { classes: 'bg-rose-50 text-rose-600', icon: User, label: 'People' },
  place: { classes: 'bg-teal-50 text-teal-600', icon: Home, label: 'Places' },
  object: { classes: 'bg-amber-50 text-amber-600', icon: Image, label: 'Objects' },
  memory: { classes: 'bg-blue-50 text-blue-600', icon: Heart, label: 'Memories' },
  routine: { classes: 'bg-green-50 text-green-600', icon: Repeat, label: 'Routines' },
};

export function MemoriesPage() {
  const { patientId = '' } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    getPatientById(patientId).then((result) => {
      if (!mounted) return;
      setPatient(result.data);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const [memories, setMemories] = useState<MemoryEntry[]>(() =>
    mockMemories.filter((m) => m.patientId === patientId)
  );
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null);

  const filteredMemories = useMemo(() => {
    if (activeTab === 'all') return memories.filter((m) => m.active);
    if (activeTab === 'inactive') return memories.filter((m) => !m.active);
    return memories.filter((m) => m.category === activeTab && m.active);
  }, [memories, activeTab]);

  const counts = useMemo(() => categoryCounts(memories), [memories]);
  const activeCount = memories.filter((m) => m.active).length;
  const inactiveCount = memories.filter((m) => !m.active).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-5 text-sm text-slate-500">Loading patient...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-5 text-sm text-red-600" role="alert">
          Unable to load this patient: {error}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card">
          <EmptyState title="Patient not found" description="This patient profile is not available." icon={User} />
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingMemory(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEdit = (memory: MemoryEntry) => {
    setEditingMemory(memory);
    setDialogMode('edit');
    setDialogOpen(true);
    setSelectedMemory(null);
  };

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setSelectedMemory(null);
  };

  const handleToggleActive = (id: string) => {
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
    setSelectedMemory((prev) => prev && prev.id === id ? { ...prev, active: !prev.active } : prev);
  };

  const handleSubmit = (data: MemoryFormData) => {
    if (dialogMode === 'add') {
      const newMemory: MemoryEntry = {
        id: generateId(),
        patientId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
        category: data.category,
        context: data.context || undefined,
        recordedAt: new Date().toISOString(),
        active: data.active,
      };
      setMemories((prev) => [...prev, newMemory]);
    } else if (editingMemory) {
      setMemories((prev) => prev.map((m) => m.id === editingMemory.id ? {
        ...m,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
        category: data.category,
        context: data.context || undefined,
        active: data.active,
      } : m));
    }
    setDialogOpen(false);
    setEditingMemory(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Link to={`/patients/${patientId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {patient.name}
      </Link>

      <PageHeader
        title="Memory Assistance"
        description={`${patient.name} · Memory support and familiar reminders`}
        actions={
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add memory
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <BookHeart className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </div>
          <div><p className="text-xs text-slate-500">Total</p><p className="text-lg font-bold text-slate-900">{memories.length}</p></div>
        </div>
        {counts.map(({ category, count }) => {
          const { classes, icon: Icon, label } = categoryIconClasses[category];
          return (
            <div key={category} className="card flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${classes}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div><p className="text-xs text-slate-500">{label}</p><p className="text-lg font-bold text-slate-900">{count}</p></div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <TabBar tabs={filterTabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as TabId)} />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-medium text-green-600">
            {activeCount} active
          </span>
          {inactiveCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-500">
              {inactiveCount} inactive
            </span>
          )}
        </div>
      </div>

      {filteredMemories.length > 0 ? (
        <MemoryList memories={filteredMemories} onSelect={setSelectedMemory} />
      ) : (
        <div className="card">
          <EmptyState
            title={activeTab === 'inactive' ? 'No inactive memories' : 'No memories in this category'}
            description="Add a new memory to help support daily recall and familiarity."
            icon={BookHeart}
          />
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Memory Assistance is a supportive tool for recalling familiar people, places, and routines. It is not a diagnostic or medical system.
      </p>

      {selectedMemory && (
        <MemoryDetail
          memory={selectedMemory}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      <MemoryFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={editingMemory}
        onClose={() => { setDialogOpen(false); setEditingMemory(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
