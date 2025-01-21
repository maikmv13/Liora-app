export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CompletedGoal {
  date: string;
  weight: number;
  targetWeight: number;
}

export interface SubGoal {
  weight: number;
  description: string;
}