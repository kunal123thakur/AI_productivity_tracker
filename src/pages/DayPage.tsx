import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import TaskList from '../components/TaskList';
import AddTaskDialog from '../components/AddTaskDialog';
import TimerPlayer from '../components/TimerPlayer';
import DailyStats from '../components/DailyStats';
import AiInsightBox from '../components/AiInsightBox';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';
import { getTasksByDate, createTask, deleteTask, type Task } from '../api/taskApi';
import { getDailySummary, type DailySummary } from '../api/summaryApi';
import { getDailyInsight } from '../api/insightApi';

interface DayPageProps {
  date: string;
  onBack: () => void;
}

export default function DayPage({ date, onBack }: DayPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DailySummary>({
    total_focus_time: 0,
    total_pause_time: 0,
    distractions_count: 0,
  });
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, summaryData] = await Promise.all([
        getTasksByDate(date),
        getDailySummary(date),
      ]);
      setTasks(tasksData);
      setSummary(summaryData);

      if (tasksData.length > 0 && tasksData.some(t => t.status === 'completed')) {
        setInsightLoading(true);
        const insightData = await getDailyInsight(date);
        setInsight(insightData.insight_text);
        setInsightLoading(false);
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const handleAddTask = async (title: string, duration: number) => {
    try {
      await createTask(title, date, duration);
      await loadData();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      await loadData();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  const handleTaskComplete = async () => {
    await loadData();
    setSelectedTask(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Calendar
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h1>
              <p className="text-gray-600">Manage your tasks and track your progress</p>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBox message={error} />
          </div>
        )}

        <div className="mb-8">
          <DailyStats summary={summary} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tasks</h2>
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onSelectTask={setSelectedTask}
              selectedTaskId={selectedTask?.id}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Timer</h2>
            {selectedTask ? (
              <TimerPlayer task={selectedTask} onComplete={handleTaskComplete} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Select a task to start the timer
              </div>
            )}
          </div>
        </div>

        <AiInsightBox insight={insight} loading={insightLoading} />
      </div>

      <AddTaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddTask}
        date={date}
      />
    </div>
  );
}
