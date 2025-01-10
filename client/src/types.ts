export type MealType = 'desayuno' | 'comida' | 'cena';
export type FilterMealType = 'comida' | 'cena' | 'all';
export type DinnerMealType = 'comida' | 'cena';

export type Recipe = {
  id: string;
  name: string;
  side_dish: string | null;
  meal_type: MealType;
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
  isFavorite: boolean;
  
  // Campos legacy para compatibilidad
  Plato: string;
  Acompañamiento: string;
  Tipo: MealType;
  Categoria: string;
  Comensales: number;
  Ingredientes: any[];
  Calorias: string;
  Proteínas: string;
  Carbohidratos: string;
  Grasas: string;
  'Tiempo de preparación': string;
  Instrucciones: Record<string, string>;
  PDF_Url: string;
};

export type MenuItem = {
  recipe: Recipe;
  day: string;
  type?: MealType;
  meal: DinnerMealType;
};

export type ShoppingItem = {
  // Campos nuevos
  name?: string;
  quantity?: number;
  unit?: string;
  checked?: boolean;
  category?: string;
  recipes?: string[];
  
  // Campos legacy
  nombre: string;
  cantidad: number;
  unidad: string;
  comprado: boolean;
  categoria: string;
  dias: string[];
};

// Base para recetas favoritas
interface BaseFavoriteRecipe extends Omit<Recipe, 'isFavorite'> {
  notes?: string;
  rating: number;
  lastCooked?: string;
  tags?: string[];
  addedAt: string;
}

// Tipo para crear favoritos
export type NewFavoriteRecipe = BaseFavoriteRecipe & {
  isFavorite: boolean;
};

// Tipo para favoritos existentes
export type FavoriteRecipe = BaseFavoriteRecipe & {
  isFavorite: true;
};

// Tipo auxiliar para el filtro de comidas
export type MealFilter = FilterMealType;

// Agregar un tipo para el estado del filtro
export type FilterState = FilterMealType;
export type FilterAction = (type: FilterState) => void;