import type { Database } from './supabase';
import type { Recipe } from './recipe';

export type MealType = 'desayuno' | 'comida' | 'cena' | 'snack';
export type UnitType = Database['public']['Enums']['unit_type'];
export type IngredientCategory = Database['public']['Enums']['ingredient_category'];

export interface MenuItem {
  day: string;
  meal: MealType;
  recipe: Recipe;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  category: IngredientCategory;
  checked: boolean;
  days: string[];
  purchasedQuantity?: number;
  dailyQuantities?: Record<string, number>;
}

export interface RecipeCardProps {
  recipe: Recipe & {
    isFavorite?: boolean;
  };
  onClick: () => void;
  onToggleFavorite: () => void;
}

export interface RecipeIngredient {
  id: string;
  ingredient_id: string;
  recipe_id: string;
  quantity: number;
  unit: string;
  ingredients?: {
    id: string;
    name: string;
    category: string;
  };
}

export * from './recipe';
export * from './profile';