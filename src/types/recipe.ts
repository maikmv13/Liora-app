import type { Database } from './supabase';

type DbRecipe = Database['public']['Tables']['recipes']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];
type DbRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];

// Definimos el tipo para los ingredientes de la receta
export interface RecipeIngredient extends Omit<DbRecipeIngredient, 'ingredients'> {
  ingredients: DbIngredient;  // La relación con la tabla ingredients
}

// Actualizamos la interfaz Recipe
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  servings: number;
  prep_time?: string;  // Cambiado a string porque así está en la DB
  cook_time?: string;  // Cambiado a string porque así está en la DB
  meal_type?: string;
  category?: string;
  calories?: string;   // Cambiado a string porque así está en la DB
  recipe_ingredients?: RecipeIngredient[];
  isFavorite?: boolean;
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

export type MealCategory = Database['public']['Enums']['meal_category'];
export type MealType = Database['public']['Enums']['meal_type'];
export type UnitType = Database['public']['Enums']['unit_type']; 

