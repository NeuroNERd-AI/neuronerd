import { CalendarDays, Eye, Pencil, Power, Trash2, X } from 'lucide-react';
import type { MemoryEntry } from '@/types';
import { memoryCategoryConfig, formatMemoryDate } from '@/components/patients/MemoryCard';

interface MemoryDetailProps {
  memory: MemoryEntry;
  onEdit: (memory: MemoryEntry) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onClose: () => void;
}

export function MemoryDetail({ memory, onEdit, onDelete, onToggleActive, onClose }: MemoryDetailProps) {
  const { icon: Icon, classes, label } = memoryCategoryConfig[memory.category];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="memory-detail-title">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="relative">
          {memory.imageUrl ? (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-slate-100">
              <img src={memory.imageUrl} alt={memory.title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className={`flex aspect-[16/9] w-full items-center justify-center rounded-t-2xl ${classes}`}>
              <Icon className="h-16 w-16 opacity-40" aria-hidden="true" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-900"
            aria-label="Close detail"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
            </span>
            {!memory.active && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Inactive</span>
            )}
          </div>

          <h2 id="memory-detail-title" className="text-xl font-bold text-slate-900">{memory.title}</h2>

          <p className="text-sm leading-6 text-slate-600">{memory.description}</p>

          {memory.context && (
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Relationship / Context</p>
              <p className="mt-0.5 text-sm font-medium text-slate-700">{memory.context}</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-400">Created</p>
                <p className="font-medium text-slate-700">{formatMemoryDate(memory.recordedAt)}</p>
              </div>
            </div>
            {memory.lastReviewedAt && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Eye className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <div>
                  <p className="text-xs text-slate-400">Last reviewed</p>
                  <p className="font-medium text-slate-700">{formatMemoryDate(memory.lastReviewedAt)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onEdit(memory)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
            </button>
            <button
              type="button"
              onClick={() => onToggleActive(memory.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                memory.active
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Power className="h-4 w-4" aria-hidden="true" /> {memory.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(memory.id)}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
