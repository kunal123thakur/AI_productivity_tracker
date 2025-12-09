import { API_BASE_URL, getHeaders } from './config';

export interface TaskSession {
  id: number;
  task_id: number;
  start_time: string;
  end_time?: string;
  active_duration: number;
  status: string;
}

export const startTask = async (taskId: number): Promise<TaskSession> => {
  const response = await fetch(`${API_BASE_URL}/timer/${taskId}/start`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to start task');
  }

  return response.json();
};

export const pauseTask = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/timer/0/pause`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to pause task');
  }
};

export const resumeTask = async (sessionId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/timer/0/resume`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to resume task');
  }
};

export const completeTask = async (sessionId: number, activeDuration: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/timer/0/complete`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ session_id: sessionId, active_duration: activeDuration }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete task');
  }
};
