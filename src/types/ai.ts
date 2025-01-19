import type { Database } from './supabase';
import type { Recipe } from './recipe';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recipe?: Recipe; // Añadimos la propiedad recipe opcional
}

export type ContextCategory = 
  | 'recipes'
  | 'shopping'
  | 'nutrition'
  | 'planning'
  | 'general';

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbWeeklyMenu = Database['public']['Tables']['weekly_menus']['Row'];
type DbRecipe = Database['public']['Tables']['recipes']['Row'];
type DbShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type DbRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row'];
type DbIngredient = Database['public']['Tables']['ingredients']['Row'];
type DbFavorite = Database['public']['Tables']['favorites']['Row'];

interface RecipeWithIngredients extends DbRecipe {
  recipe_ingredients: (DbRecipeIngredient & {
    ingredients: DbIngredient;
  })[];
}

interface FavoriteWithRecipe extends DbFavorite {
  recipes: RecipeWithIngredients;
}

interface WeeklyMenuWithRecipes extends DbWeeklyMenu {
  [K in keyof DbWeeklyMenu as K extends `${string}_breakfast_id` | `${string}_lunch_id` | `${string}_dinner_id` | `${string}_snack_id` ? K : never]: {
    id: string;
    name: string;
    description?: string;
    meal_type: Database['public']['Enums']['meal_type'];
    category: Database['public']['Enums']['meal_category'];
  } | null;
}

export interface AIContext {
  userProfile: DbProfile;
  weeklyMenu: WeeklyMenuWithRecipes[];
  recipes: RecipeWithIngredients[];
  shoppingList: DbShoppingList | null;
  favorites: FavoriteWithRecipe[];
  categories: ContextCategory[];
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  actions?: {
    type: 'recipe_suggestion' | 'meal_plan' | 'health_tip';
    data: any;
  }[];
}