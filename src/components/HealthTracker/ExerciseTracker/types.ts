export interface ExerciseEntry {
  id: string;
  name: string;
  duration: number;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  intensity: 'low' | 'medium' | 'high';
  calories?: number;
}

export interface ExerciseMilestone {
  id: string;
  title: string;
  description: string;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  achieved: boolean;
}