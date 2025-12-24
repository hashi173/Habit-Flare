export interface Habit {
  id: string;
  name: string;
  icon: string; // Icon name key
  color: string;
  frequency: number[]; // 0-6 (Sunday-Saturday)
  alarmTime?: string; // HH:mm
  streak: number;
  history: string[]; // ISO Date strings (YYYY-MM-DD)
  createdAt: number;
}

export type View = 'home' | 'calendar' | 'settings' | 'add-habit';

export interface UserSettings {
  darkMode: boolean;
  // Removed name, isLoggedIn, loginProvider for local-only app
}