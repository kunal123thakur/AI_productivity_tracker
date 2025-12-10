import { AI_SERVICE_URL } from './config';
import { Task } from './taskApi';
import { DailySummary, WeeklySummaryItem } from './summaryApi';

export interface Insight {
  insight_text: string;
}

export interface DailyAIInsight {
  date: string;
  total_study_minutes: number;
  distractions: number;
  pauses: number;
  max_focus_block: number;
  min_focus_block: number;
  avg_focus_block: number;
  peak_focus_hour: string;
  slump_hour: string;
  productivity_score: number;
  focus_efficiency: number;
  tips: string[];
  tasks: Array<{ task_id: string; study_minutes: number; pauses: number }>;
}

export interface WeeklyAIInsight {
  week_start: string;
  total_study_minutes: number;
  total_distractions: number;
  avg_daily_study: number;
  avg_daily_distractions: number;
  best_focus_day: string;
  worst_focus_day: string;
  max_focus_block_week: number;
  weekly_productivity_score: number;
  consistency_score: number;
  weekly_tips: string[];
  daily: Array<{ date: string; study_minutes: number; distractions: number }>;
}

export const getTaskInsight = async (task: Task): Promise<Insight> => {
  const response = await fetch(`${AI_SERVICE_URL}/ai_task_insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch task insight');
  }

  return response.json();
};

export const getDailyInsight = async (date: string, summary: DailySummary, tasks: Task[]): Promise<DailyAIInsight> => {
  const response = await fetch(`${AI_SERVICE_URL}/ai_daily_insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      date, 
      summary: { ...summary, date, id: 0, created_at: new Date().toISOString() }, 
      tasks 
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily insight');
  }

  return response.json();
};

export const getWeeklyInsight = async (
  startDate: string, 
  endDate: string, 
  summaries: WeeklySummaryItem[], 
  tasks: Task[]
): Promise<WeeklyAIInsight> => {
  const daily_summaries = summaries.map((s, i) => ({
    id: i,
    date: s.date,
    total_focus_time: s.total_focus_time,
    total_pause_time: s.total_pause_time,
    distractions_count: s.distractions_count,
    created_at: new Date().toISOString()
  }));

  const response = await fetch(`${AI_SERVICE_URL}/weekly_analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      start_date: startDate,
      end_date: endDate,
      daily_summaries: daily_summaries,
      tasks 
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weekly insight');
  }

  return response.json();
};
