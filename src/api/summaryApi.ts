import { API_BASE_URL, getHeaders } from './config';

export interface DailySummary {
  total_focus_time: number;
  total_pause_time: number;
  distractions_count: number;
}

export interface WeeklySummaryItem {
  date: string;
  total_focus_time: number;
  total_pause_time: number;
  distractions_count: number;
}

export const getDailySummary = async (date: string): Promise<DailySummary> => {
  const response = await fetch(`${API_BASE_URL}/summary/daily?date=${date}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily summary');
  }

  return response.json();
};

export const getWeeklySummary = async (): Promise<WeeklySummaryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/summary/weekly`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weekly summary');
  }

  return response.json();
};

export const getMonthlySummary = async (): Promise<WeeklySummaryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/summary/monthly`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monthly summary');
  }

  return response.json();
};
