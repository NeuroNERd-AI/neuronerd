import type { ReactNode } from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function Placeholder({ title, description, children }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
        <Construction className="h-7 w-7 text-blue-600" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      )}
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  );
}
