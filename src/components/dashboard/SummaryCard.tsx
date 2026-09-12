import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone: 'blue' | 'green' | 'amber' | 'teal';
}

const toneClasses: Record<SummaryCardProps['tone'], string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  teal: 'bg-teal-50 text-teal-600',
};

export function SummaryCard({ label, value, detail, icon: Icon, tone }: SummaryCardProps) {
  return (
    <article className="card flex min-h-[142px] flex-col justify-between p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </article>
  );
}
