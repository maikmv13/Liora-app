export interface FoodGroupType {
  id: string;
  name: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  examples: string[];
  tips: string[];
}