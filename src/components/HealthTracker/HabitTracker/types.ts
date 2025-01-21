interface Habit {
  id: string;
  title: string;
  category: 'physical' | 'mental' | 'social' | 'selfcare';
  icon: string;
  isCompleted: boolean;
  duration?: number;
  notes?: string;
  isCustom?: boolean;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

interface DailyEntry {
  date: string;
  habits: Habit[];
  mood?: MoodEntry;
}

export type { Habit, MoodEntry, DailyEntry };