import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
