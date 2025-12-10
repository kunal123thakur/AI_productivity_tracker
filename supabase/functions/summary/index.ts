import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    if (path === '/summary/daily' && req.method === 'GET') {
      const date = url.searchParams.get('date');
      if (!date) {
        return new Response(JSON.stringify({ error: 'Date parameter required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: tasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('date', date);

      if (!tasks || tasks.length === 0) {
        return new Response(JSON.stringify({
          total_focus_time: 0,
          total_pause_time: 0,
          distractions_count: 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const taskIds = tasks.map((t: any) => t.id);

      const { data: sessions } = await supabase
        .from('task_sessions')
        .select('id, active_duration')
        .in('task_id', taskIds);

      const totalFocusTime = sessions?.reduce((sum: number, s: any) => sum + (s.active_duration || 0), 0) || 0;

      const sessionIds = sessions?.map((s: any) => s.id) || [];
      const { data: pauseLogs } = await supabase
        .from('task_pause_logs')
        .select('duration')
        .in('session_id', sessionIds)
        .not('duration', 'is', null);

      const totalPauseTime = pauseLogs?.reduce((sum: number, p: any) => sum + (p.duration || 0), 0) || 0;
      const distractionsCount = pauseLogs?.length || 0;

      const summary = {
        total_focus_time: totalFocusTime,
        total_pause_time: totalPauseTime,
        distractions_count: distractionsCount,
      };

      await supabase
        .from('daily_summary')
        .upsert({
          date,
          ...summary,
        }, { onConflict: 'date' });

      return new Response(JSON.stringify(summary), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/summary/weekly' && req.method === 'GET') {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const { data: summaries } = await supabase
        .from('daily_summary')
        .select('*')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: true });

      return new Response(JSON.stringify(summaries || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/summary/monthly' && req.method === 'GET') {
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');

      let startDate, endDate;

      if (year && month) {
        // Construct start and end dates for the specific month
        const y = parseInt(year);
        const m = parseInt(month) - 1; // JS months are 0-11
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m + 1, 0); // Last day of the month
      } else {
        // Default to last 30 days if no params provided
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 30);
      }

      // Format as YYYY-MM-DD
      // Note: toISOString() uses UTC. We should be careful with timezones. 
      // Using simple string formatting to match database DATE type.
      // const startDateStr = startDate.toISOString().split('T')[0];
      // const endDateStr = endDate.toISOString().split('T')[0];
      
      // Better to use local time construction for date strings to avoid timezone shift issues
      const formatDate = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      const { data: summaries } = await supabase
        .from('daily_summary')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true });

      return new Response(JSON.stringify(summaries || []), {
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
