import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function generateTaskInsight(taskData: any): string {
  const insights = [
    'Breaking tasks into smaller sessions can improve focus and reduce fatigue.',
    'Consider scheduling breaks between focus sessions for optimal productivity.',
    'Your task completion pattern suggests morning sessions are most productive.',
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

function generateDailyInsight(data: any): string {
  const { total_focus_time, total_pause_time, distractions_count } = data;
  
  if (distractions_count > 10) {
    return `You experienced ${distractions_count} distractions today. Try using focus techniques like the Pomodoro method to reduce interruptions.`;
  }
  
  if (total_pause_time > total_focus_time * 0.3) {
    return `Your pause time is ${Math.round(total_pause_time / 60)} minutes. Consider identifying and eliminating common distractions.`;
  }
  
  const focusMinutes = Math.round(total_focus_time / 60);
  return `Great focus today with ${focusMinutes} minutes of productive work! Keep maintaining this momentum.`;
}

function generateWeeklyInsight(summaries: any[]): string {
  if (summaries.length === 0) {
    return 'Start tracking your tasks to receive personalized insights about your productivity patterns.';
  }
  
  const avgFocus = summaries.reduce((sum, s) => sum + s.total_focus_time, 0) / summaries.length;
  const avgDistract = summaries.reduce((sum, s) => sum + s.distractions_count, 0) / summaries.length;
  
  if (avgDistract > 8) {
    return `You average ${Math.round(avgDistract)} distractions per day. Creating a dedicated workspace might help improve focus.`;
  }
  
  const focusHours = Math.round(avgFocus / 3600 * 10) / 10;
  return `Your weekly average is ${focusHours} hours of focused work per day. Consistency is key to building productive habits.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname;

    if (path === '/insight/task' && req.method === 'POST') {
      const { task_id } = await req.json();
      
      const { data: task } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', task_id)
        .single();

      const insightText = generateTaskInsight(task);

      const { data: insight, error } = await supabase
        .from('ai_insights')
        .insert({
          insight_type: 'task',
          reference_id: task_id,
          insight_text: insightText,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ insight_text: insightText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/insight/daily' && req.method === 'POST') {
      const { date } = await req.json();

      // Fetch all relevant data for the date
      const { data: summary } = await supabase
        .from('daily_summary')
        .select('*')
        .eq('date', date)
        .maybeSingle();

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, task_sessions(*, task_pause_logs(*))')
        .eq('date', date);

      // Construct payload for Python backend
      const payload = {
        date,
        summary: summary || {},
        tasks: tasks || []
      };

      // Call Python backend
      // Using 0.0.0.0 or localhost depends on environment. Assuming accessible via localhost/host.docker.internal
      // If running in Supabase local dev (Docker), host.docker.internal reaches the host.
      // If running as Deno process locally, localhost works. 
      // User specified 0.0.0.0 for python server, so it's listening on all interfaces.
      // We'll try host.docker.internal for Docker compatibility, falling back/assuming it works.
      // But standard Supabase Edge Functions run in Deno deploy which can't access local.
      // Assuming this is for LOCAL development as per "d:\kunal projects..." context.
      const pythonResponse = await fetch('https://python-personalised-timetable-management.onrender.com/ai_daily_insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!pythonResponse.ok) {
        throw new Error(`Python backend error: ${pythonResponse.statusText}`);
      }

      const insightData = await pythonResponse.json();
      
      // Store the structured data as stringified JSON in insight_text to preserve schema compatibility
      const insightText = JSON.stringify(insightData);

      const { data: existing } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('date', date)
        .eq('insight_type', 'daily')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('ai_insights')
          .update({ insight_text: insightText })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('ai_insights')
          .insert({
            date,
            insight_type: 'daily',
            insight_text: insightText,
          });
      }

      // Return the structured data directly
      return new Response(JSON.stringify(insightData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/insight/weekly' && req.method === 'POST') {
      // Get date range (last 7 days or current week)
      // The frontend doesn't send date for weekly currently, assumes current week or calculated on server
      // Let's fetch last 7 days of data for now
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const { data: dailySummaries } = await supabase
        .from('daily_summary')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*, task_sessions(*, task_pause_logs(*))')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      const payload = {
        start_date: startDateStr,
        end_date: endDateStr,
        daily_summaries: dailySummaries || [],
        tasks: tasks || []
      };

      const pythonResponse = await fetch('https://python-personalised-timetable-management.onrender.com/weekly_analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!pythonResponse.ok) {
        throw new Error(`Python backend error: ${pythonResponse.statusText}`);
      }

      const insightData = await pythonResponse.json();
      const insightText = JSON.stringify(insightData);

      const { data: insight, error } = await supabase
        .from('ai_insights')
        .insert({
          insight_type: 'weekly',
          insight_text: insightText,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(insightData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
