import React, { useState, useEffect } from 'react';
import { View, Habit, UserSettings } from './types';
import { getTodayISO, formatDate } from './utils/dateUtils';
import Home from './views/Home';
import AddHabit from './views/AddHabit';
import CalendarView from './views/CalendarView';
import SettingsView from './views/Settings';
import BottomNav from './components/BottomNav';

const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [initialized, setInitialized] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habitflare_habits');
    const savedSettings = localStorage.getItem('habitflare_settings');

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error("Failed to parse habits", e);
      }
    }
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (initialized) {
        localStorage.setItem('habitflare_habits', JSON.stringify(habits));
        localStorage.setItem('habitflare_settings', JSON.stringify(settings));
        
        // Apply Dark Mode
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
  }, [habits, settings, initialized]);

  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'history' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: Date.now().toString(),
      streak: 0,
      history: [],
      createdAt: Date.now(),
    };
    setHabits([...habits, newHabit]);
    setView('home');
  };

  const handleToggleHabit = (id: string, dateISO: string = getTodayISO()) => {
    setHabits(prevHabits => prevHabits.map(h => {
      if (h.id !== id) return h;

      const hasDoneOnDate = h.history.includes(dateISO);
      let newHistory = [...h.history];
      
      if (hasDoneOnDate) {
        // Toggle off
        newHistory = newHistory.filter(date => date !== dateISO);
      } else {
        // Toggle on
        newHistory.push(dateISO);
      }
      
      return { ...h, history: newHistory };
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleResetData = () => {
    // 1. Wipe storage completely
    localStorage.clear();
    
    // 2. Reset State directly (React will update UI immediately without reload)
    setHabits([]);
    setSettings(DEFAULT_SETTINGS);
    
    // 3. Immediately remove dark mode class to ensure UI sync
    document.documentElement.classList.remove('dark');

    // 4. Move user back to home to see the empty state
    setView('home');
  };

  if (!initialized) return null;

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white relative z-10">
      
      <main className="text-gray-900 dark:text-gray-100">
        {view === 'home' && (
            <Home 
                habits={habits} 
                onToggleHabit={handleToggleHabit} 
            />
        )}
        {view === 'add-habit' && (
            <AddHabit onAdd={handleAddHabit} onCancel={() => setView('home')} />
        )}
        {view === 'calendar' && (
            <CalendarView habits={habits} />
        )}
        {view === 'settings' && (
            <SettingsView 
                settings={settings} 
                updateSettings={handleUpdateSettings} 
                onResetData={handleResetData}
            />
        )}
      </main>

      {/* Hide Bottom Nav on full screen forms like 'Add Habit' */}
      {view !== 'add-habit' && (
        <BottomNav currentView={view} setView={setView} />
      )}
    </div>
  );
};

export default App;