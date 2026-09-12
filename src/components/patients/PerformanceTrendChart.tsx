import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GameSession } from '@/types';

interface PerformanceTrendChartProps {
  sessions: GameSession[];
  gameName?: string;
  metrics?: ('accuracy' | 'score' | 'durationMinutes')[];
}

interface ChartPoint {
  label: string;
  accuracy: number;
  score: number;
  durationMinutes: number;
}

const metricConfig = {
  accuracy: { stroke: '#2563eb', label: 'Accuracy', format: (v: number) => `${v}%` },
  score: { stroke: '#14b8a6', label: 'Score', format: (v: number) => `${v} pts` },
  durationMinutes: { stroke: '#f59e0b', label: 'Duration', format: (v: number) => `${v} min` },
};

export function PerformanceTrendChart({ sessions, gameName, metrics = ['accuracy', 'score'] }: PerformanceTrendChartProps) {
  const filtered = gameName ? sessions.filter((s) => s.gameName === gameName) : sessions;
  const chartData: ChartPoint[] = [...filtered]
    .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    .slice(-10)
    .map((session) => ({
      label: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(session.completedAt)),
      accuracy: session.accuracy,
      score: session.score,
      durationMinutes: session.durationMinutes,
    }));

  if (chartData.length === 0) return null;

  const ariaLabel = gameName
    ? `Line chart showing performance trends for ${gameName}`
    : 'Line chart showing performance trends across recent game sessions';

  return (
    <div className="h-64 w-full" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }}
            labelStyle={{ color: '#0f172a', fontWeight: 600 }}
            formatter={(value, name) => {
              const metricKey = String(name) as keyof typeof metricConfig;
              const config = metricConfig[metricKey];
              const displayValue = Number(value ?? 0);
              return [config.format(displayValue), config.label];
            }}
          />
          {metrics.map((metric) => {
            const config = metricConfig[metric];
            return (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={config.label}
                stroke={config.stroke}
                strokeWidth={metric === 'accuracy' ? 3 : 2}
                strokeDasharray={metric === 'score' ? '5 5' : metric === 'durationMinutes' ? '2 4' : undefined}
                dot={{ r: 3, fill: config.stroke, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
