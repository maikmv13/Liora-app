export interface WaterEntry {
  date: string;
  amount: number;
}

export interface WaterMilestone {
  id: string;
  title: string;
  description: string;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  achieved: boolean;
}