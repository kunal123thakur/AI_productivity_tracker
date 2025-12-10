const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;
export const AI_SERVICE_URL = 'https://python-personalised-timetable-management.onrender.com';

export const getHeaders = () => ({
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});
