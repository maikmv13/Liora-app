export type MealType = 'desayuno' | 'comida' | 'snack' | 'cena';

export interface Recipe {
  id: string;
  name: string;
  user_id?: string;
  image_url?: string;
  calories?: number | string;
  category?: string;
  side_dish?: string;
  servings: number;
  description?: string;
  prep_time?: string;
  cook_time?: string;
  meal_type?: string;
  recipe_ingredients?: any[];
  instructions?: Record<string, string>;
  // Info nutricional
  proteins?: string;
  carbohydrates?: string;
  fats?: string;
  fiber?: string;
  sodium?: string;
  // Otros campos
  tags?: string[];
  isFavorite?: boolean;
}

export interface MenuItem {
  meal: MealType;
  recipe: Recipe;
  day: string; // Campo necesario para el menú semanal
}

export interface FavoriteRecipe {
  id: string;
  recipe_id: string;
  user_id: string;
  last_cooked: string | null;
  notes: string | null;
  rating: number;
  tags: string[];
  created_at?: string;
  member_name?: string;
  // Campos necesarios de Recipe que pueden ser usados en algunas partes
  name?: string;
  servings?: number;
  image_url?: string;
  calories?: string | number;
  category?: string;
  prep_time?: string;
} 