export type Recipe = {
  id: string;
  name: string;
  side_dish: string | null;
  meal_type: 'desayuno' | 'comida' | 'cena' | 'snack';
  category: 'Carnes' | 'Pescados' | 'Vegetariano' | 'Pasta' | 'Sopas' | 'Ensaladas';
  servings: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: 'sobre' | 'gramo' | 'unidad' | 'pizca' | 'cucharada' | 'cucharadita';
  }[];
  calories: string;
  energy_kj: string;
  fats: string;
  saturated_fats: string;
  carbohydrates: string;
  sugars: string;
  fiber: string;
  proteins: string;
  sodium: string;
  prep_time: string;
  instructions: Record<string, string>;
  url: string | null;
  pdf_url: string | null;
  
  // Campos legacy para compatibilidad
  Plato: string;
  Acompañamiento: string;
  Tipo: 'desayuno' | 'comida' | 'cena' | 'snack';
  Categoria: string;
  Comensales: number;
  Ingredientes: any[];
  Calorias: string;
  'Tiempo de preparación': string;
  Instrucciones: Record<string, string>;
  PDF_Url: string;
  isFavorite?: boolean;
};

export type MenuItem = {
  recipe: Recipe;
  day: string;
  type: 'desayuno' | 'comida' | 'cena';
};

export type MealType = 'desayuno' | 'comida' | 'cena';

export type ShoppingItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category: string;
  recipes: string[];
};

export type FavoriteRecipe = Recipe & {
  isFavorite: boolean;
}; 