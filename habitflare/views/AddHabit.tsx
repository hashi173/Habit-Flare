import React, { useState } from 'react';
import { ICON_KEYS, ICONS, COLORS } from '../constants';
import { Habit } from '../types';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { View } from '../types';

interface AddHabitProps {
  onAdd: (habit: Omit<Habit, 'id' | 'streak' | 'history' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddHabit: React.FC<AddHabitProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('fitness');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [frequency, setFrequency] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [alarmTime, setAlarmTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (index: number) => {
    if (frequency.includes(index)) {
      setFrequency(frequency.filter(d => d !== index));
    } else {
      setFrequency([...frequency, index].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      icon: selectedIcon,
      color: selectedColor,
      frequency,
      alarmTime: alarmTime || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <div className="sticky top-0 bg-white dark:bg-slate-900 z-20 px-4 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
         <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft />
         </button>
         <h2 className="text-lg font-bold">New Habit</h2>
         <div className="w-8"></div> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* Name Input */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Habit Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read 30 mins"
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-slate-700 focus:border-brand-500 outline-none py-2 placeholder-gray-300 dark:placeholder-slate-600 dark:text-white transition-colors"
                autoFocus
            />
        </div>

        {/* Icon Selection */}
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Icon</label>
            <div className="grid grid-cols-6 gap-3">
                {ICON_KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedIcon(key)}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                            selectedIcon === key 
                            ? 'bg-brand-500 text-white shadow-lg scale-110' 
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {ICONS[key]}
                    </button>
                ))}
            </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Color</label>
            <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${color} ${
                            selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-200 dark:ring-offset-slate-900 scale-110' : ''
                        }`}
                    />
                ))}
            </div>
        </div>

        {/* Frequency */}
        <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Frequency</label>
            <div className="flex justify-between">
                {days.map((day, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                            frequency.includes(index)
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>

        {/* Notification */}
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Reminder</label>
                <div className="relative">
                     <input 
                        type="time" 
                        value={alarmTime}
                        onChange={(e) => setAlarmTime(e.target.value)}
                        className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-brand-500"
                     />
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none mt-8"
        >
            Create Habit
        </button>

      </form>
    </div>
  );
};

export default AddHabit;