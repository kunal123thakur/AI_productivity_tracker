/*
  # Productivity Tracker Database Schema

  1. New Tables
    - `tasks`
      - `id` (bigserial, primary key)
      - `title` (text, task name)
      - `date` (date, scheduled date)
      - `planned_duration` (integer, seconds)
      - `status` (text, 'pending' or 'completed')
      - `created_at` (timestamptz)
    
    - `task_sessions`
      - `id` (bigserial, primary key)
      - `task_id` (bigint, foreign key to tasks)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `active_duration` (integer, seconds)
      - `status` (text, 'active', 'paused', 'completed')
    
    - `task_pause_logs`
      - `id` (bigserial, primary key)
      - `session_id` (bigint, foreign key to task_sessions)
      - `pause_start` (timestamptz)
      - `pause_end` (timestamptz, nullable)
      - `duration` (integer, seconds, nullable)
    
    - `daily_summary`
      - `id` (bigserial, primary key)
      - `date` (date, unique)
      - `total_focus_time` (integer, seconds)
      - `total_pause_time` (integer, seconds)
      - `distractions_count` (integer)
      - `created_at` (timestamptz)
    
    - `ai_insights`
      - `id` (bigserial, primary key)
      - `date` (date, nullable)
      - `insight_type` (text, 'daily', 'weekly', 'task')
      - `reference_id` (bigint, nullable, for task-specific insights)
      - `insight_text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add permissive policies for single-user app (no auth required)
*/

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  planned_duration integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on tasks"
  ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Task sessions table
CREATE TABLE IF NOT EXISTS task_sessions (
  id bigserial PRIMARY KEY,
  task_id bigint NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  active_duration integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on task_sessions"
  ON task_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Task pause logs table
CREATE TABLE IF NOT EXISTS task_pause_logs (
  id bigserial PRIMARY KEY,
  session_id bigint NOT NULL REFERENCES task_sessions(id) ON DELETE CASCADE,
  pause_start timestamptz NOT NULL DEFAULT now(),
  pause_end timestamptz,
  duration integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_pause_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on task_pause_logs"
  ON task_pause_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Daily summary table
CREATE TABLE IF NOT EXISTS daily_summary (
  id bigserial PRIMARY KEY,
  date date NOT NULL UNIQUE,
  total_focus_time integer NOT NULL DEFAULT 0,
  total_pause_time integer NOT NULL DEFAULT 0,
  distractions_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on daily_summary"
  ON daily_summary
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id bigserial PRIMARY KEY,
  date date,
  insight_type text NOT NULL,
  reference_id bigint,
  insight_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on ai_insights"
  ON ai_insights
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_task_sessions_task_id ON task_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_pause_logs_session_id ON task_pause_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_daily_summary_date ON daily_summary(date);
CREATE INDEX IF NOT EXISTS idx_ai_insights_date ON ai_insights(date);