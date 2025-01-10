export type MealType = 'comida' | 'cena';

export interface Ingredient {
  Nombre: string;
  Cantidad: number;
  Unidad: string;
  Categoria?: string;
}

export type Instructions = {
  [key: string]: string;
};

export interface Recipe {
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
}

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

export type Database = {
  public: {
    Tables: {
      recipes: {
        Row: {
          // ... propiedades de la receta ...
          name: string;
          category: string;
          servings: number;
          prep_time?: string;
          calories: number;
          meal_type: string;
          side_dish?: string;
        }
      }
    }
  }
};

export type meal_category = 'Carnes' | 'Pescados' | 'Vegetariano' | 'Pasta' | 'Sopas' | 'Ensaladas' | 'Todas';