import { Activity, Clock3, Target } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyActivity } from '@/types';

interface ActivityChartProps {
  data: DailyActivity[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const completedSessions = data.reduce((total, day) => total + day.sessions, 0);
  const completionRate = Math.round(data.reduce((total, day) => total + day.completionRate, 0) / data.length);
  const averageAccuracy = Math.round(data.reduce((total, day) => total + day.avgAccuracy, 0) / data.length);
  const averageDuration = Math.round(data.reduce((total, day) => total + day.avgDurationMinutes, 0) / data.length);

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Activity overview</h2>
          <p className="mt-1 text-sm text-slate-500">Game sessions over the recent period</p>
        </div>
        <span className="badge bg-blue-50 text-blue-700">Last 7 days</span>
      </div>
      <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1fr_220px]">
        <div className="h-64 min-w-0" aria-label="Line chart showing game sessions and completion rate over the last seven days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="sessions" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <YAxis yAxisId="rate" orientation="right" domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                formatter={(value, name) => {
                  const isCompletionRate = String(name) === 'completionRate';
                  const displayValue = Number(value ?? 0);
                  return [
                    isCompletionRate ? `${displayValue}%` : displayValue,
                    isCompletionRate ? 'Completion rate' : 'Sessions',
                  ];
                }}
              />
              <Line yAxisId="sessions" type="monotone" dataKey="sessions" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
              <Line yAxisId="rate" type="monotone" dataKey="completionRate" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-lg bg-blue-50/70 p-3">
            <div className="flex items-center gap-2 text-blue-700"><Activity className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-medium">Sessions</span></div>
            <p className="mt-1 text-xl font-bold text-slate-900">{completedSessions}</p>
          </div>
          <div className="rounded-lg bg-teal-50/70 p-3">
            <div className="flex items-center gap-2 text-teal-700"><Target className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-medium">Completion rate</span></div>
            <p className="mt-1 text-xl font-bold text-slate-900">{completionRate}%</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-slate-600"><Target className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-medium">Average accuracy</span></div>
            <p className="mt-1 text-xl font-bold text-slate-900">{averageAccuracy}%</p>
          </div>
          <div className="rounded-lg bg-amber-50/70 p-3">
            <div className="flex items-center gap-2 text-amber-700"><Clock3 className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-medium">Avg. duration</span></div>
            <p className="mt-1 text-xl font-bold text-slate-900">{averageDuration} min</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" />Game sessions</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />Completion rate</span>
      </div>
    </section>
  );
}
