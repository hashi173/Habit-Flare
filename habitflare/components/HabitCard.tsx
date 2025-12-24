import React, { useState } from 'react';
import { Check, Flame, Clock, Zap, Lock, Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { ICONS } from '../constants';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isCompletedToday: boolean;
  isDisabled?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onToggle, 
  onDelete,
  isCompletedToday, 
  isDisabled 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheck = () => {
    if (isDisabled) return;
    
    setIsAnimating(true);
    onToggle(habit.id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(habit.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20 dark:border-slate-700 flex items-center justify-between transition-all hover:shadow-md ${isDisabled ? 'opacity-60 grayscale-[0.5]' : 'hover:scale-[1.01]'}`}>
        
        {/* Icon và Thông tin Habit */}
        <div className="flex items-center space-x-4 flex-1">
          <div className={`p-3 rounded-xl ${habit.color} bg-opacity-15 text-opacity-100 flex items-center justify-center`}>
             <div className={`text-${habit.color.replace('bg-', '')}`}>
               {ICONS[habit.icon] || <Zap />}
             </div>
          </div>
          <div className="flex-1">
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

        {/* Nút Check và Nút Delete nằm ngang */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Nút Check/Toggle */}
          <button
            onClick={handleCheck}
            disabled={isDisabled}
            className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative overflow-hidden flex-shrink-0
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
            
            {/* Particle animation effect */}
            {isAnimating && isCompletedToday && !isDisabled && (
                <div className="absolute inset-0 bg-white opacity-20 animate-ping rounded-full"></div>
            )}
          </button>

          {/* Nút Delete */}
          <button
            onClick={handleDeleteClick}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Modal Xác nhận Xóa */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all border border-gray-100 dark:border-slate-800">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 dark:text-red-400">
                <Trash2 size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">Delete Habit?</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-300">"{habit.name}"</span>? 
              <br/>
              This will erase all your progress and streak history.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={confirmDelete}
                className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Yes, Delete It
              </button>
              <button 
                onClick={cancelDelete}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitCard;
