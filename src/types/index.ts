export type MealType = 'comida' | 'cena';

export type Ingredient = {
  Nombre: string;
  Cantidad: number;
  Unidad: string;
  Categoria: string;
};

export type Instructions = {
  [key: string]: string;
};

export type Recipe = {
  Plato: string;
  Acompañamiento: string;
  Tipo: MealType;
  Categoria: string;
  Comensales: number;
  Ingredientes: Ingredient[];
  Calorias: string;
  "Valor energético (kJ)": string;
  Grasas: string;
  Saturadas: string;
  Carbohidratos: string;
  Azúcares: string;
  Fibra: string;
  Proteínas: string;
  Sodio: string;
  "Tiempo de preparación": string;
  Instrucciones: Instructions;
  Url: string;
  PDF_Url: string;
  isFavorite?: boolean;
};

export type MenuItem = {
  recipe: Recipe;
  meal: MealType;
  day: string;
};

export type ShoppingItem = {
  nombre: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  comprado: boolean;
  dias: string[];
};

export type FavoriteRecipe = Recipe & {
  addedAt: string;
  lastCooked?: string;
  notes?: string;
  rating?: number;
  tags?: string[];
};