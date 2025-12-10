import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthlySummary } from '../api/summaryApi';

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export default function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [distractions, setDistractions] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const summaries = await getMonthlySummary(month, year);
        
        const distractionMap: Record<string, number> = {};
        summaries.forEach(s => {
          distractionMap[s.date] = s.distractions_count;
        });
        setDistractions(distractionMap);
      } catch (error) {
        console.error('Failed to fetch monthly summary', error);
      }
    };
    fetchMonthlyData();
  }, [currentMonth]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return formatDate(day) === selectedDate;
  };

  const getDistractionColor = (count: number) => {
    if (count < 5) return 'bg-green-700';
    if (count <= 20) return 'bg-yellow-500';
    if (count <= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(formatDate(day))}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg font-medium transition-all relative ${
          isSelected(day)
            ? 'bg-blue-500 text-white shadow-lg'
            : isToday(day)
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>{day}</span>
        {distractions[formatDate(day)] !== undefined && (
          <div 
            className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getDistractionColor(distractions[formatDate(day)])}`} 
            title={`Distractions: ${distractions[formatDate(day)]}`}
          />
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
