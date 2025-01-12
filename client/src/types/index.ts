import type { Database } from './supabase';
import type { Recipe } from './recipe';

export type MealType = Database['public']['Enums']['meal_type'];
export type UnitType = Database['public']['Enums']['unit_type'];
export type IngredientCategory = Database['public']['Enums']['ingredient_category'];

export interface MenuItem {
  recipe: Recipe;
  day: string;
  meal: MealType;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  category: IngredientCategory;
  checked: boolean;
  days: string[];
}

export interface RecipeCardProps {
  recipe: Recipe & {
    isFavorite?: boolean;
  };
  onClick: () => void;
  onToggleFavorite: () => void;
}

export * from './recipe';
export * from './profile';