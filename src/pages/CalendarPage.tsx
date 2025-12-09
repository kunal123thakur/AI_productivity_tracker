import { useState } from 'react';
import CalendarView from '../components/CalendarView';

interface CalendarPageProps {
  onDateSelect: (date: string) => void;
}

export default function CalendarPage({ onDateSelect }: CalendarPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Calendar</h1>
          <p className="text-gray-600">Select a date to view or manage tasks</p>
        </div>

        <CalendarView onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
