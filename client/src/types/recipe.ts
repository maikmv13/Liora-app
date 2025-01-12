import type { Database } from './supabase';

type DbRecipe = Database['public']['Tables']['recipes']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];
type DbRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];
type DbFavorite = Database['public']['Tables']['favorites']['Row'];

export interface Recipe extends DbRecipe {
  recipe_ingredients?: (DbRecipeIngredient & {
    ingredient?: DbIngredient;
  })[];
}

export interface FavoriteRecipe extends DbFavorite {
  recipe?: Recipe;
} 