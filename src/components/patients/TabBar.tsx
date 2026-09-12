import type { LucideIcon } from 'lucide-react';

interface TabBarProps {
  tabs: { id: string; label: string; icon: LucideIcon }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Patient profile sections"
      className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
