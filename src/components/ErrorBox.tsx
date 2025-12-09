import { AlertCircle } from 'lucide-react';

interface ErrorBoxProps {
  message: string;
}

export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-red-800 font-semibold mb-1">Error</h3>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
}
