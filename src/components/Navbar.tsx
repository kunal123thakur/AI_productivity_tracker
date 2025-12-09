import { Calendar, BarChart3, Home } from 'lucide-react';

interface NavbarProps {
  currentPage: 'calendar' | 'day' | 'weekly';
  onNavigate: (page: 'calendar' | 'weekly') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Productivity Tracker</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'calendar' || currentPage === 'day'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => onNavigate('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'weekly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Weekly Summary</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
