import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    const taskIdMatch = path.match(/\/timer\/(\d+)\//);
    if (!taskIdMatch) {
      return new Response(JSON.stringify({ error: 'Invalid task ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const taskId = taskIdMatch[1];

    if (path.includes('/start') && req.method === 'POST') {
      const { data: session, error } = await supabase
        .from('task_sessions')
        .insert({
          task_id: taskId,
          start_time: new Date().toISOString(),
          status: 'active',
          active_duration: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.includes('/pause') && req.method === 'POST') {
      const { session_id } = await req.json();

      const { data: session } = await supabase
        .from('task_sessions')
        .select('*')
        .eq('id', session_id)
        .single();

      if (!session) throw new Error('Session not found');

      const { error: pauseError } = await supabase
        .from('task_pause_logs')
        .insert({
          session_id,
          pause_start: new Date().toISOString(),
        });

      if (pauseError) throw pauseError;

      const { error: updateError } = await supabase
        .from('task_sessions')
        .update({ status: 'paused' })
        .eq('id', session_id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.includes('/resume') && req.method === 'POST') {
      const { session_id } = await req.json();

      const { data: pauseLog } = await supabase
        .from('task_pause_logs')
        .select('*')
        .eq('session_id', session_id)
        .is('pause_end', null)
        .order('pause_start', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pauseLog) {
        const pauseDuration = Math.floor(
          (new Date().getTime() - new Date(pauseLog.pause_start).getTime()) / 1000
        );

        await supabase
          .from('task_pause_logs')
          .update({
            pause_end: new Date().toISOString(),
            duration: pauseDuration,
          })
          .eq('id', pauseLog.id);
      }

      const { error } = await supabase
        .from('task_sessions')
        .update({ status: 'active' })
        .eq('id', session_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.includes('/complete') && req.method === 'POST') {
      const { session_id, active_duration } = await req.json();

      const { data: session } = await supabase
        .from('task_sessions')
        .select('task_id')
        .eq('id', session_id)
        .single();

      if (!session) throw new Error('Session not found');

      const { error: sessionError } = await supabase
        .from('task_sessions')
        .update({
          end_time: new Date().toISOString(),
          active_duration,
          status: 'completed',
        })
        .eq('id', session_id);

      if (sessionError) throw sessionError;

      const { error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', session.task_id);

      if (taskError) throw taskError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});