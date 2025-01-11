export * from './types/index';

interface Recipe {
  id: string;
  name: string;
  side_dish: string;
  meal_type: string;
  category: string;
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
  url: string;
  pdf_url: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  isFavorite: boolean;
}