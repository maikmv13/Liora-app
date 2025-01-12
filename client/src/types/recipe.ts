export interface Recipe {
  id: string;
  name: string;
  side_dish: string | null;
  meal_type: 'desayuno' | 'comida' | 'cena' | 'snack';
  category: string;
  servings: number;
  calories: string | null;
  instructions: Record<string, string>;
  image_url: string | null;
  recipe_ingredients: {
    ingredient_id: string;
    quantity: number;
    unit: string;
  }[];
}

export interface FavoriteRecipe extends Recipe {
  addedAt: string | null;
  lastCooked: string | null;
  notes: string | null;
  rating: number | null;
  tags: string[] | null;
} 