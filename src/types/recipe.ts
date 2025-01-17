import type { Database } from './supabase';

type DbRecipe = Database['public']['Tables']['recipes']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];
type DbRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];
type DbFavorite = Database['public']['Tables']['favorites']['Row'];

export interface Recipe extends DbRecipe {
  recipe_ingredients?: (DbRecipeIngredient & {
    ingredients?: DbIngredient;
  })[];
  isFavorite?: boolean;
  cuisine_type?: CuisineType;
}

export interface FavoriteRecipe extends Recipe {
  created_at: string | null;
  last_cooked: string | null;
  notes: string | null;
  rating: number | null;
  tags: string[] | null;
}

export type MealCategory = Database['public']['Enums']['meal_category'];
export type MealType = Database['public']['Enums']['meal_type'];
export type UnitType = Database['public']['Enums']['unit_type']; 

