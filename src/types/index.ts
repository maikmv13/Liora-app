import type { Database } from './supabase';
import type { Recipe } from './recipe';

export type MealType = 'desayuno' | 'comida' | 'cena' | 'snack';
export type UnitType = Database['public']['Enums']['unit_type'];
export type IngredientCategory = Database['public']['Enums']['ingredient_category'];

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: string;
  linked_household_id: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface WeeklyMenu {
  id: string;
  user_id: string;
  linked_household_id: string | null;
  created_by: string;
  created_at: string;
  [key: string]: any; // Para los campos dinámicos de recetas
}

export interface MenuItem {
  menu_id: string;
  linked_household_id?: string;
  recipe: Recipe;
  day: string;
  meal: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: UnitType;
  ingredient: Ingredient;
}

export interface FavoriteRecipe extends Recipe {
  favorite_id?: string;
  created_at?: string;
  last_cooked?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
  user_id?: string;
  member_name?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
  linked_household_id: string | null;
  created_at: string;
  notes?: string;
  rating?: number;
  last_cooked?: string;
  tags?: string[];
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
  linked_household_id?: string | null;
}

export interface RecipeCardProps {
  recipe: Recipe & {
    isFavorite?: boolean;
  };
  onClick: () => void;
  onToggleFavorite: () => void;
}

export * from './profile';
export type { Recipe } from './recipe';