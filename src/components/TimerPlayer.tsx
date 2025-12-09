import { useEffect, useState } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { startTask, pauseTask, resumeTask, completeTask } from '../api/timerApi';
import type { Task } from '../api/taskApi';

interface TimerPlayerProps {
  task: Task;
  onComplete: () => void;
}

export default function TimerPlayer({ task, onComplete }: TimerPlayerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(task.planned_duration);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
        setActiveDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const handleStart = async () => {
    try {
      const session = await startTask(task.id);
      setSessionId(session.id);
      setIsRunning(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  const handlePause = async () => {
    if (!sessionId) return;
    try {
      await pauseTask(sessionId);
      setIsPaused(true);
    } catch (error) {
      console.error('Failed to pause task:', error);
    }
  };

  const handleResume = async () => {
    if (!sessionId) return;
    try {
      await resumeTask(sessionId);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume task:', error);
    }
  };

  const handleComplete = async () => {
    if (!sessionId) return;
    try {
      await completeTask(sessionId, activeDuration);
      setIsRunning(false);
      setIsPaused(false);
      onComplete();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="text-sm">
            Planned: {formatTime(task.planned_duration)}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-800 mb-2">
          {formatTime(remainingTime)}
        </div>
        <div className="text-sm text-gray-500">
          Active Duration: {formatTime(activeDuration)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Square className="w-5 h-5" />
              Complete
            </button>
          </>
        )}
      </div>

      {task.status === 'completed' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center font-medium">
            Task Completed!
          </p>
        </div>
      )}
    </div>
  );
}
