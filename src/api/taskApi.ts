import { API_BASE_URL, getHeaders } from './config';

export interface Task {
  id: number;
  title: string;
  date: string;
  planned_duration: number;
  status: string;
  created_at: string;
}

export const createTask = async (title: string, date: string, planned_duration: number): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/task/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title, date, planned_duration }),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
};

export const getTasksByDate = async (date: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/task/list?date=${date}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};
