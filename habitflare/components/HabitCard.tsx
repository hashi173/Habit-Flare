import React, { useState } from 'react';
import { Check, Flame, Clock, Zap, Lock } from 'lucide-react';
import { Habit } from '../types';
import { ICONS } from '../constants';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  isCompletedToday: boolean;
  isDisabled?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, isCompletedToday, isDisabled }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheck = () => {
    if (isDisabled) return;
    
    setIsAnimating(true);
    onToggle(habit.id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20 dark:border-slate-700 flex items-center justify-between transition-all hover:shadow-md ${isDisabled ? 'opacity-60 grayscale-[0.5]' : 'hover:scale-[1.01]'}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${habit.color} bg-opacity-15 text-opacity-100 flex items-center justify-center`}>
           <div className={`text-${habit.color.replace('bg-', '')}`}>
             {ICONS[habit.icon] || <Zap />}
           </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{habit.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
             <div className="flex items-center text-xs text-brand-600 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
                <Flame size={12} className="mr-1 fill-brand-500 text-brand-500" />
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
             </div>
             {habit.alarmTime && (
                <div className="flex items-center text-xs text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {habit.alarmTime}
                </div>
             )}
          </div>
        </div>
      </div>

      <button
        onClick={handleCheck}
        disabled={isDisabled}
        className={`
            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative overflow-hidden
            ${isDisabled 
                ? 'bg-gray-100 border-gray-200 dark:bg-slate-700 dark:border-slate-600 cursor-not-allowed' 
                : isCompletedToday 
                    ? 'bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/30 cursor-pointer' 
                    : 'bg-transparent border-gray-200 dark:border-slate-600 hover:border-brand-300 cursor-pointer'}
        `}
      >
        {isDisabled ? (
            <div className="text-gray-300 dark:text-gray-500">
                <Lock size={16} />
            </div>
        ) : isCompletedToday ? (
             <Check className="text-white w-6 h-6 animate-bounce-short" strokeWidth={3} />
        ) : (
             <div className="w-full h-full bg-gray-50 dark:bg-slate-700 opacity-0 hover:opacity-10 transition-opacity" />
        )}
        
        {/* Particle animation effect placeholder */}
        {isAnimating && isCompletedToday && !isDisabled && (
            <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full"></div>
        )}
      </button>
    </div>
  );
};

export default HabitCard;