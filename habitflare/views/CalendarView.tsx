import React, { useState } from 'react';
import { Habit } from '../types';
import { getMonthDays, formatDate, isSameDay, calculateStreak } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Flame, BarChart2, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { ICONS } from '../constants';

interface CalendarViewProps {
  habits: Habit[];
}

type Tab = 'calendar' | 'stats';

const CalendarView: React.FC<CalendarViewProps> = ({ habits }) => {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getMonthDays(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Determine heatmap intensity or completion status
  const getDayStatus = (date: Date | null) => {
    if (!date) return 'empty';
    const isoDate = formatDate(date);
    
    let completedCount = 0;
    const activeHabits = habits.filter(h => h.frequency.includes(date.getDay()));
    
    if (activeHabits.length === 0) return 'none'; // No habits scheduled

    activeHabits.forEach(h => {
        if (h.history.includes(isoDate)) completedCount++;
    });

    if (completedCount === 0) return 'none';
    const percentage = completedCount / activeHabits.length;

    if (percentage === 1) return 'full';
    if (percentage >= 0.5) return 'high';
    return 'low';
  };

  const getCellClass = (status: string) => {
      switch (status) {
          case 'full': return 'bg-brand-500 text-white';
          case 'high': return 'bg-brand-300 dark:bg-brand-600 text-white';
          case 'low': return 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300';
          case 'none': return 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600';
          default: return '';
      }
  };

  // Stats Logic
  const calculateCompletionRate = (habit: Habit) => {
    // Simple calculation: History length / Days since creation (approx)
    // For accuracy, we'd iterate every day since creation.
    // Simplifying for UI demo: Rate based on last 30 days
    const today = new Date();
    let opportunities = 0;
    let completed = 0;
    
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const iso = formatDate(d);
        if (habit.frequency.includes(d.getDay())) {
            opportunities++;
            if (habit.history.includes(iso)) completed++;
        }
    }
    return opportunities === 0 ? 0 : Math.round((completed / opportunities) * 100);
  };

  const overallCompletionRate = () => {
      if (habits.length === 0) return 0;
      const rates = habits.map(calculateCompletionRate);
      const sum = rates.reduce((a, b) => a + b, 0);
      return Math.round(sum / habits.length);
  };

  const getBestStreakHabit = () => {
      if (habits.length === 0) return null;
      return [...habits].sort((a, b) => calculateStreak(b.history) - calculateStreak(a.history))[0];
  };

  const bestHabit = getBestStreakHabit();
  const overallRate = overallCompletionRate();

  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen flex flex-col">
      
      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-200 dark:bg-slate-800 rounded-xl mb-6">
        <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-white' : 'text-gray-500'}`}
        >
            <CalendarIcon size={16} /> History
        </button>
        <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-white' : 'text-gray-500'}`}
        >
            <BarChart2 size={16} /> Statistics
        </button>
      </div>

      {activeTab === 'calendar' && (
          <div className="animate-fade-in">
            {/* Calendar Control */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><ChevronLeft /></button>
                    <h2 className="text-xl font-bold">{monthName} {year}</h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><ChevronRight /></button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4 text-center">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-gray-400">{d}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => {
                        if (!date) return <div key={index} className="aspect-square"></div>;
                        
                        const status = getDayStatus(date);
                        const isToday = isSameDay(date, new Date());
                        
                        return (
                            <div 
                                key={index} 
                                className={`
                                    aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                                    ${getCellClass(status)}
                                    ${isToday ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-800' : ''}
                                `}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-100 dark:bg-slate-800"></div>
                        <span>0%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-brand-100 dark:bg-brand-900"></div>
                        <span>1-49%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
              
              {/* Overall Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-5">
                          <TrendingUp size={60} />
                      </div>
                      <div className="text-gray-500 text-xs font-bold uppercase mb-1">Completion Rate</div>
                      <div className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-end gap-1">
                          {overallRate}<span className="text-sm font-bold text-gray-400 mb-1">%</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Last 30 Days</div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-5">
                          <Flame size={60} />
                      </div>
                      <div className="text-gray-500 text-xs font-bold uppercase mb-1">Best Streak</div>
                      <div className="text-3xl font-extrabold text-orange-500 flex items-end gap-1">
                          {bestHabit ? calculateStreak(bestHabit.history) : 0}<span className="text-sm font-bold text-gray-400 mb-1">days</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">{bestHabit?.name || '-'}</div>
                  </div>
              </div>

              {/* Habit Performance List */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold mb-4">Habit Breakdown</h3>
                  <div className="space-y-6">
                      {habits.map(habit => {
                          const rate = calculateCompletionRate(habit);
                          const streak = calculateStreak(habit.history);
                          return (
                              <div key={habit.id} className="group">
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg ${habit.color} bg-opacity-20 text-brand-600`}>
                                              <div className={`text-${habit.color.replace('bg-', '')} w-4 h-4`}>
                                                 {ICONS[habit.icon] || <Flame size={16} />}
                                              </div>
                                          </div>
                                          <span className="font-bold text-sm">{habit.name}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs font-bold">
                                          <div className="flex items-center text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
                                              <Flame size={10} className="mr-1" /> {streak}
                                          </div>
                                          <span className="text-gray-600 dark:text-gray-300">{rate}%</span>
                                      </div>
                                  </div>
                                  {/* Progress Bar */}
                                  <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                          className={`h-full ${habit.color} transition-all duration-1000 ease-out`} 
                                          style={{ width: `${rate}%` }}
                                      />
                                  </div>
                              </div>
                          );
                      })}
                      
                      {habits.length === 0 && (
                          <div className="text-center text-gray-400 py-4 text-sm">No habits to analyze yet.</div>
                      )}
                  </div>
              </div>

          </div>
      )}

    </div>
  );
};

export default CalendarView;