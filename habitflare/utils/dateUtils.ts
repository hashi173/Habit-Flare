export const getTodayISO = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset*60*1000));
  return adjustedDate.toISOString().split('T')[0];
};

export const formatDate = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset*60*1000));
  return adjustedDate.toISOString().split('T')[0];
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const getDayName = (dayIndex: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
};

export const getMonthDays = (year: number, month: number): (Date | null)[] => {
  const date = new Date(year, month, 1);
  const days: (Date | null)[] = [];
  
  // Fill empty slots for previous month
  for (let i = 0; i < date.getDay(); i++) {
    days.push(null);
  }

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
};

export const getDatesInWeek = (baseDate: Date): Date[] => {
  const days: Date[] = [];
  const currentDay = baseDate.getDay(); // 0 (Sun) to 6 (Sat)
  
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay); // Go back to Sunday
  
  for(let i=0; i<7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
};

// Robust function to subtract N days from a YYYY-MM-DD string
// Uses 12:00 PM local time logic to avoid Daylight Saving Time bugs
const subtractDays = (dateStr: string, daysToSubtract: number): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d, 12, 0, 0); 
  date.setDate(date.getDate() - daysToSubtract);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateStreak = (history: string[]): number => {
  if (!history || history.length === 0) return 0;
  
  const historySet = new Set(history);
  const today = getTodayISO();
  const yesterday = subtractDays(today, 1);

  let streak = 0;
  let checkDate = today;

  // 1. Determine start of the streak
  if (historySet.has(today)) {
    // If done today, streak is active
    streak = 1;
    checkDate = yesterday;
  } else if (historySet.has(yesterday)) {
    // If not done today, but done yesterday, streak is still active
    streak = 1;
    checkDate = subtractDays(yesterday, 1);
  } else {
    // If neither today nor yesterday is done, streak is broken
    return 0;
  }

  // 2. Count backwards strictly
  while (true) {
    if (historySet.has(checkDate)) {
      streak++;
      checkDate = subtractDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
};