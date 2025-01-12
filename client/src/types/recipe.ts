export interface Recipe {
  id: string;
  name: string;
  side_dish: string | null;
  meal_type: 'desayuno' | 'comida' | 'cena' | 'snack';
  category: string;
  servings: number;
  calories: string | null;
  instructions: Record<string, string> | null;
  image_url: string | null;
  recipe_ingredients: {
    ingredient_id: string;
    quantity: number;
    unit: string;
  }[];
  Plato: string;
  Acompañamiento: string;
  Tipo: string;
  Categoria: string;
  Instrucciones: Record<string, string> | null;
}

export interface FavoriteRecipe extends Recipe {
  addedAt: string | null;
  lastCooked: string | null;
  notes: string | null;
  rating: number | null;
  tags: string[] | null;
} 