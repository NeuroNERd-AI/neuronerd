import { BookHeart, Heart, Home, Image, Repeat, User } from 'lucide-react';
import type { MemoryEntry, MemoryCategory } from '@/types';
import { MemoryCard } from '@/components/patients/MemoryCard';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface MemoryListProps {
  memories: MemoryEntry[];
  onSelect: (memory: MemoryEntry) => void;
}

const categoryConfig: { category: MemoryCategory; label: string; icon: typeof Heart }[] = [
  { category: 'person', label: 'Important People', icon: User },
  { category: 'place', label: 'Familiar Places', icon: Home },
  { category: 'object', label: 'Important Objects', icon: Image },
  { category: 'memory', label: 'Personal Memories', icon: Heart },
  { category: 'routine', label: 'Daily Routines', icon: Repeat },
];

export function MemoryList({ memories, onSelect }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="card">
        <EmptyState title="No memories yet" description="Shared memories and reminders will appear here as they are recorded by caregivers." icon={BookHeart} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categoryConfig.map(({ category, label, icon: Icon }) => {
        const items = memories.filter((m) => m.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} aria-labelledby={`section-${category}`}>
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <h2 id={`section-${category}`} className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{items.length}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} onClick={onSelect} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
