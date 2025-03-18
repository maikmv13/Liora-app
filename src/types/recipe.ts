import type { Database } from './supabase';
import type { IngredientCategory } from './index';
// Importamos FavoriteRecipe de types.ts principal
import type { FavoriteRecipe } from '../types';

type DbRecipe = Database['public']['Tables']['recipes']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];
type DbRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];

// Definimos el tipo para los ingredientes de la receta
export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: UnitType;
  ingredient: {
    id: string;
    name: string;
    category: Database['public']['Enums']['ingredient_category'];
  };
}

// Actualizamos la interfaz Recipe
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  servings: number;
  prep_time?: string;  // Cambiado a string para QuickInfo
  cook_time?: string;
  meal_type?: string;
  category?: string;
  recipe_ingredients?: RecipeIngredient[];
  instructions?: Record<string, string>;
  // Info nutricional
  calories?: string;
  proteins?: string;
  carbohydrates?: string;
  fats?: string;
  fiber?: string;
  sodium?: string;
  // Otros campos
  tags?: string[];  // Añadido para QuickInfo
  isFavorite?: boolean;
}

// Eliminamos la definición duplicada de FavoriteRecipe
// export interface FavoriteRecipe extends Recipe {
//   favorite_id?: string;
//   created_at?: string;
//   last_cooked?: string;
//   notes?: string;
//   rating?: number;
//   tags?: string[];
//   user_id?: string;
//   member_name?: string;
// }

// Re-exportamos FavoriteRecipe de types.ts para mantener compatibilidad
export { FavoriteRecipe };

export type MealCategory = Database['public']['Enums']['meal_category'];
export type MealType = Database['public']['Enums']['meal_type'];
export type UnitType = Database['public']['Enums']['unit_type']; 

