import { Clock, Pause, AlertCircle } from 'lucide-react';
import type { DailySummary } from '../api/summaryApi';

interface DailyStatsProps {
  summary: DailySummary;
}

export default function DailyStats({ summary }: DailyStatsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const stats = [
    {
      icon: Clock,
      label: 'Total Focus Time',
      value: formatTime(summary.total_focus_time),
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      icon: Pause,
      label: 'Total Pause Time',
      value: formatTime(summary.total_pause_time),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      icon: AlertCircle,
      label: 'Distractions',
      value: summary.distractions_count.toString(),
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
          </div>
          <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
