import { Trash2, CheckCircle, Circle } from 'lucide-react';
import type { Task } from '../api/taskApi';

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onSelectTask: (task: Task) => void;
  selectedTaskId?: number;
}

export default function TaskList({ tasks, onDelete, onSelectTask, selectedTaskId }: TaskListProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks for this day. Add a task to get started!
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedTaskId === task.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {task.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Duration: {formatDuration(task.planned_duration)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
