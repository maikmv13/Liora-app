export type MealType = 'desayuno' | 'comida' | 'snack' | 'cena';

export interface Recipe {
  id: string;
  name: string;
  user_id?: string;
  image_url?: string;
  calories?: number;
  category?: string;
  side_dish?: string;
  servings: number;
  // ... otros campos
}

export interface MenuItem {
  meal: MealType;
  recipe: Recipe;
} 