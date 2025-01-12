import type { Database } from './supabase';
import type { Recipe } from './recipe';

export type MealType = Database['public']['Enums']['meal_type'];

export interface MenuItem {
  recipe: Recipe;
  day: string;
  meal: MealType;
}

export * from './recipe';
export * from './profile';