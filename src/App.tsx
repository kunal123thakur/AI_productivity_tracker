import { useState } from 'react';
import Navbar from './components/Navbar';
import CalendarPage from './pages/CalendarPage';
import DayPage from './pages/DayPage';
import WeeklySummaryPage from './pages/WeeklySummaryPage';
import WelcomeSection from './components/WelcomeSection';

type Page = 'calendar' | 'day' | 'weekly';

function App() {
  const today = new Date().toISOString().split('T')[0];
  const [currentPage, setCurrentPage] = useState<Page>('calendar');
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentPage('day');
  };

  const handleNavigate = (page: 'calendar' | 'weekly') => {
    setCurrentPage(page);
  };

  const handleBackToCalendar = () => {
    setCurrentPage('calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeSection />
      
      <div id="main-content" className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        {currentPage === 'calendar' && <CalendarPage onDateSelect={handleDateSelect} />}
        {currentPage === 'day' && <DayPage date={selectedDate} onBack={handleBackToCalendar} />}
        {currentPage === 'weekly' && <WeeklySummaryPage />}
      </div>
    </div>
  );
}

export default App;
