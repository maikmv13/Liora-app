import type { Database } from './supabase';
import type { Recipe } from './recipe';

// Tipos de la base de datos
export type MealType = Database['public']['Enums']['meal_type'];
export type MealCategory = Database['public']['Enums']['meal_category'];
export type UnitType = Database['public']['Enums']['unit_type'];
export type IngredientCategory = Database['public']['Enums']['ingredient_category'];

// Interfaces específicas de la aplicación
export interface MenuItem {
  recipe: Recipe;
  day: string;
  meal: MealType;
}

export interface ShoppingItem {
  nombre: string;
  cantidad: number;
  unidad: UnitType;
  categoria: IngredientCategory;
  comprado: boolean;
  dias: string[];
}

export interface RecipeCardProps {
  recipe: Recipe & {
    isFavorite?: boolean;
  };
  onClick: () => void;
  onToggleFavorite: () => void;
}