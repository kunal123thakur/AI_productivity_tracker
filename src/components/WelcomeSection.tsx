import { ChevronDown } from 'lucide-react';

export default function WelcomeSection() {
  const handleScroll = () => {
    const content = document.getElementById('main-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-6 animate-fade-in-up">
          Focus. Analyze. Improve.
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-500 leading-relaxed">
          Your AI-powered productivity companion. Track your tasks, analyze your patterns, and unlock your potential.
        </p>
        
        <button
          onClick={handleScroll}
          className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-1000 flex items-center gap-2 mx-auto"
        >
          Get Started
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-8 left-0 w-full flex justify-center animate-bounce z-10">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>
    </div>
  );
}
