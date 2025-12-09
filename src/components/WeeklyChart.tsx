import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeeklySummaryItem } from '../api/summaryApi';

interface WeeklyChartProps {
  data: WeeklySummaryItem[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    focusHours: parseFloat((item.total_focus_time / 3600).toFixed(2)),
    pauseHours: parseFloat((item.total_pause_time / 3600).toFixed(2)),
    distractions: item.distractions_count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Weekly Activity</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="focusHours" fill="#3b82f6" name="Focus (hours)" />
          <Bar dataKey="pauseHours" fill="#eab308" name="Pause (hours)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Distractions Trend</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="distractions" fill="#ef4444" name="Distractions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
