import { useEffect, useState } from 'react';
import { Heart, Home, Image, Repeat, User, X } from 'lucide-react';
import type { MemoryEntry, MemoryCategory } from '@/types';

export interface MemoryFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: MemoryCategory;
  context: string;
  active: boolean;
}

interface MemoryFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: MemoryEntry | null;
  onClose: () => void;
  onSubmit: (data: MemoryFormData) => void;
}

const categoryOptions: { value: MemoryCategory; label: string; icon: typeof Heart; classes: string }[] = [
  { value: 'person', label: 'Important Person', icon: User, classes: 'bg-rose-50 text-rose-600 border-rose-200' },
  { value: 'place', label: 'Familiar Place', icon: Home, classes: 'bg-teal-50 text-teal-600 border-teal-200' },
  { value: 'object', label: 'Important Object', icon: Image, classes: 'bg-amber-50 text-amber-600 border-amber-200' },
  { value: 'memory', label: 'Personal Memory', icon: Heart, classes: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'routine', label: 'Daily Routine', icon: Repeat, classes: 'bg-green-50 text-green-600 border-green-200' },
];

export function MemoryFormDialog({ open, mode, initialData, onClose, onSubmit }: MemoryFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('memory');
  const [context, setContext] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description);
        setImageUrl(initialData.imageUrl || '');
        setCategory(initialData.category);
        setContext(initialData.context || '');
        setActive(initialData.active);
      } else {
        setTitle('');
        setDescription('');
        setImageUrl('');
        setCategory('memory');
        setContext('');
        setActive(true);
      }
      setError('');
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      category,
      context: context.trim(),
      active,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="memory-dialog-title">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="memory-dialog-title" className="text-lg font-semibold text-slate-900">
            {mode === 'add' ? 'Add memory' : 'Edit memory'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Close dialog">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categoryOptions.map((option) => {
                const Icon = option.icon;
                const isActive = category === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategory(option.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
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
            <label htmlFor="memory-title" className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
            <input
              id="memory-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Family home in Shillong"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="memory-description" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="memory-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this memory, person, place, or routine"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              maxLength={300}
            />
          </div>

          <div>
            <label htmlFor="memory-context" className="mb-1.5 block text-sm font-medium text-slate-700">
              Relationship / Context <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="memory-context"
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Wife, Family home, Daily at 7 AM"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="memory-image" className="mb-1.5 block text-sm font-medium text-slate-700">
              Image URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="memory-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={active}
              onClick={() => setActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${active ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600" role="alert">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {mode === 'add' ? 'Add memory' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
