import React, { useState } from 'react';
import { Habit } from '../types';
import HabitCard from '../components/HabitCard';
import { getTodayISO, calculateStreak, getDatesInWeek, formatDate, isSameDay } from '../utils/dateUtils';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';

interface HomeProps {
  habits: Habit[];
  onToggleHabit: (id: string, dateStr: string) => void;
  onDeleteHabit: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ habits, onToggleHabit, onDeleteHabit }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateISO = formatDate(selectedDate);
  const weekDates = getDatesInWeek(selectedDate);
  const todayISO = getTodayISO();

  // Check if selected date is in the future
  const isFutureDate = selectedDateISO > todayISO;

  // Calculate total active streaks
  const totalStreak = habits.reduce((acc, h) => acc + (calculateStreak(h.history) > 0 ? 1 : 0), 0);

  const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Weekly Calendar Widget
  const renderWeeklyCalendar = () => {
    return (
      <div className="flex justify-between items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl mb-6 shadow-sm border border-white/50 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {weekDates.map((date, index) => {
          const dateISO = formatDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = dateISO === todayISO;
          
          // Check status for this day
          const habitsForDay = habits.filter(h => h.frequency.includes(date.getDay()));
          const completedCount = habitsForDay.filter(h => h.history.includes(dateISO)).length;
          const totalCount = habitsForDay.length;
          
          let indicatorColor = 'bg-gray-200 dark:bg-slate-700';
          if (totalCount > 0) {
            if (completedCount === totalCount) indicatorColor = 'bg-green-500';
            else if (completedCount > 0) indicatorColor = 'bg-sky-400';
          }

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[40px] h-[60px] rounded-xl transition-all relative
                ${isSelected 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}
              `}
            >
              <span className="text-[10px] font-bold uppercase mb-1 opacity-80">{date.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
              <span className="text-sm font-bold">{date.getDate()}</span>
              
              {/* Status Dot */}
              {!isSelected && (
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${indicatorColor}`} />
              )}
              {isToday && !isSelected && (
                 <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto min-h-screen">
      
      {/* Header */}
      <header className="mb-4">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-brand-600 dark:text-brand-300 text-sm font-bold uppercase tracking-wider mb-1">{dateStr}</p>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    My Habits
                </h1>
            </div>
            <div className="text-right">
               <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                 <Flame size={12} className="mr-1 fill-brand-500 text-brand-500" />
                 {totalStreak} Active
               </div>
            </div>
        </div>
      </header>

      {/* Mini Calendar Widget */}
      {renderWeeklyCalendar()}

      {/* Empty State */}
      {habits.length === 0 && (
          <div className="text-center py-20 opacity-60">
              <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CalendarIcon size={32} className="text-brand-300" />
              </div>
              <p className="text-lg font-medium">No habits yet</p>
              <p className="text-sm">Tap the + button to launch your first habit.</p>
          </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map(habit => (
            <HabitCard 
                key={habit.id} 
                habit={{...habit, streak: calculateStreak(habit.history)}} 
                onToggle={() => onToggleHabit(habit.id, selectedDateISO)}
                onDelete={() => onDeleteHabit(habit.id)}
                isCompletedToday={habit.history.includes(selectedDateISO)}
                isDisabled={isFutureDate}
            />
        ))}
        
        {habits.length > 0 && habits.every(h => !h.frequency.includes(selectedDate.getDay())) && (
             <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-gray-400 font-medium">No habits scheduled for this day.</p>
             </div>
        )}

        {isFutureDate && habits.length > 0 && (
            <div className="text-center text-xs text-gray-400 mt-4 italic">
                You cannot complete habits for future dates.
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;
