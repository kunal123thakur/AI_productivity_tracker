import { Lightbulb, Loader2 } from 'lucide-react';

interface AiInsightBoxProps {
  insight: string | null;
  loading?: boolean;
}

export default function AiInsightBox({ insight, loading }: AiInsightBoxProps) {
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
          ) : insight ? (
            <p className="text-gray-700 leading-relaxed">{insight}</p>
          ) : (
            <p className="text-gray-500 italic">
              Complete tasks to receive personalized insights.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
