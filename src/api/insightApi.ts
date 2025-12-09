import { API_BASE_URL, getHeaders } from './config';

export interface Insight {
  insight_text: string;
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

export const getDailyInsight = async (date: string): Promise<Insight> => {
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

export const getWeeklyInsight = async (): Promise<Insight> => {
  const response = await fetch(`${API_BASE_URL}/insight/weekly`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weekly insight');
  }

  return response.json();
};
