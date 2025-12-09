import { Lightbulb, Loader2 } from 'lucide-react';
import { DailyAIInsight, WeeklyAIInsight } from '../api/insightApi';

interface AiInsightBoxProps {
  insight: string | DailyAIInsight | WeeklyAIInsight | null;
  loading?: boolean;
}

export default function AiInsightBox({ insight, loading }: AiInsightBoxProps) {
  const renderContent = () => {
    if (typeof insight === 'string') {
      return <p className="text-gray-700 leading-relaxed">{insight}</p>;
    }
    
    if (insight && typeof insight === 'object') {
      // Handle structured insight
      const tips = 'tips' in insight ? insight.tips : 'weekly_tips' in insight ? insight.weekly_tips : [];
      const score = 'productivity_score' in insight ? insight.productivity_score : 'weekly_productivity_score' in insight ? insight.weekly_productivity_score : undefined;
      
      return (
        <div className="space-y-3">
          {score !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-blue-700">Productivity Score:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm font-medium">
                {score}/100
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex gap-2 text-gray-700">
                <span className="text-blue-400">•</span>
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
          
          {'distractions' in insight && (
             <div className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-2">
               <div>Distractions: {insight.distractions}</div>
               <div>Focus Efficiency: {(insight.focus_efficiency * 100).toFixed(0)}%</div>
             </div>
          )}
        </div>
      );
    }

    return (
      <p className="text-gray-500 italic">
        Complete tasks to receive personalized insights.
      </p>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 border border-blue-100">
      <div className="flex items-start gap-3">
        <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            AI Insight
          </h3>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating insight...</span>
            </div>
          ) : renderContent()}
        </div>
      </div>
    </div>
  );
}
