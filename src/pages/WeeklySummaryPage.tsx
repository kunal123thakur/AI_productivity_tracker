import { useState, useEffect } from 'react';
import WeeklyChart from '../components/WeeklyChart';
import AiInsightBox from '../components/AiInsightBox';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';
import { getWeeklySummary, type WeeklySummaryItem } from '../api/summaryApi';
import { getWeeklyInsight } from '../api/insightApi';

export default function WeeklySummaryPage() {
  const [summaries, setSummaries] = useState<WeeklySummaryItem[]>([]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeeklySummary();
        setSummaries(data);

        if (data.length > 0) {
          setInsightLoading(true);
          const insightData = await getWeeklyInsight();
          setInsight(insightData.insight_text);
          setInsightLoading(false);
        }
      } catch (err) {
        setError('Failed to load weekly summary. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weekly Summary</h1>
          <p className="text-gray-600">Your productivity insights for the past 7 days</p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBox message={error} />
          </div>
        )}

        {summaries.length > 0 ? (
          <>
            <div className="mb-8">
              <WeeklyChart data={summaries} />
            </div>

            <AiInsightBox insight={insight} loading={insightLoading} />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No data available yet. Start tracking your tasks to see weekly insights!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
