export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  category: string;
  meal_type: 'comida' | 'cena';
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time: number;
  ingredients: Ingredient[];
  instructions: Instruction[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface Instruction {
  id: string;
  recipe_id: string;
  step_number: number;
  description: string;
}