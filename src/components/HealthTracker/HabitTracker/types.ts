export interface Habit {
  id: string;
  title: string;
  category: 'physical' | 'mental' | 'social' | 'selfcare' | 'productivity';
  icon: string;
  isCompleted: boolean;
  frequency: string;
  time?: string;
  reminder: boolean;
  days?: string[];
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface DailyEntry {
  date: string;
  habits: Array<{
    id: string;
    isCompleted: boolean;
  }>;
  mood?: MoodEntry;
}