import React from 'react';
import { Home, Calendar, Settings, PlusCircle } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItemClass = (view: View) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentView === view
        ? 'text-brand-500'
        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg z-50 px-6">
      <div className="flex justify-between items-center h-full max-w-md mx-auto">
        <button onClick={() => setView('home')} className={navItemClass('home')}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Habits</span>
        </button>
        
        <button onClick={() => setView('add-habit')} className="flex flex-col items-center justify-center -mt-6">
            <div className="bg-brand-500 hover:bg-brand-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                <PlusCircle size={32} />
            </div>
            <span className="text-[10px] font-medium text-gray-400 mt-1">Add</span>
        </button>

        <button onClick={() => setView('calendar')} className={navItemClass('calendar')}>
          <Calendar size={24} />
          <span className="text-[10px] font-medium">History</span>
        </button>

        <button onClick={() => setView('settings')} className={navItemClass('settings')}>
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
