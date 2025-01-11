export type MealType = 'desayuno' | 'comida' | 'cena' | 'snack';

export interface Recipe {
  Plato: string;
  Acompañamiento: string | null;
  Tipo: MealType;
  Categoria: string;
  Comensales: number;
  Calorias: string;
  "Tiempo de preparación": string;
  "Valor energético (kJ)": string;
  Grasas: string;
  Saturadas: string;
  Carbohidratos: string;
  Azúcares: string;
  Fibra: string;
  Proteínas: string;
  Sodio: string;
  Instrucciones: Record<string, string>;
  Ingredientes: Array<{
    Nombre: string;
    Cantidad: number;
    Unidad: string;
    Categoria?: string;
  }>;
  Url?: string;
  PDF_Url?: string;
  image_url?: string;
}

export interface MenuItem {
  recipe: Recipe;
  day: string;
  meal: MealType;
}

export interface ShoppingItem {
  nombre: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  comprado: boolean;
  dias: string[];
}

export interface FavoriteRecipe extends Recipe {
  addedAt: string;
  notes?: string;
  rating: number;
  lastCooked?: string;
  tags?: string[];
}

export interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    side_dish: string | null;
    meal_type: MealType;
    category: "Carnes" | "Pescados" | "Pasta" | "Vegetariano" | "Ensaladas" | "Sopas";
    servings: number;
    calories: string;
    prep_time: string;
    energy_kj: string;
    fats: string;
    saturated_fats: string;
    carbohydrates: string;
    sugars: string;
    fiber: string;
    proteins: string;
    sodium: string;
    instructions: Record<string, string>;
    url?: string;
    pdf_url?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
    isFavorite?: boolean;
  };
  onClick: () => void;
  onToggleFavorite: () => void;
}