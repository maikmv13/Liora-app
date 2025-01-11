export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          name: string
          side_dish: string | null
          meal_type: 'desayuno' | 'comida' | 'cena' | 'snack'
          category: 'Carnes' | 'Pescados' | 'Vegetariano' | 'Pasta' | 'Sopas' | 'Ensaladas'
          servings: number
          calories: string | null
          energy_kj: string | null
          fats: string | null
          saturated_fats: string | null
          carbohydrates: string | null
          sugars: string | null
          fiber: string | null
          proteins: string | null
          sodium: string | null
          prep_time: string | null
          instructions: Json
          url: string | null
          pdf_url: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}