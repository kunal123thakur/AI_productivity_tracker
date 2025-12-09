import { API_BASE_URL, getHeaders } from './config';

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

export const getTaskInsight = async (taskId: number): Promise<Insight> => {
  const response = await fetch(`${API_BASE_URL}/insight/task`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ task_id: taskId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch task insight');
  }

  return response.json();
};

export const getDailyInsight = async (date: string): Promise<DailyAIInsight | Insight> => {
  const response = await fetch(`${API_BASE_URL}/insight/daily`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ date }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily insight');
  }

  return response.json();
};

export const getWeeklyInsight = async (): Promise<WeeklyAIInsight | Insight> => {
  const response = await fetch(`${API_BASE_URL}/insight/weekly`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weekly insight');
  }

  return response.json();
};
