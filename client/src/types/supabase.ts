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
      favorites: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
          notes: string | null
          rating: number | null
          last_cooked: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          created_at?: string
          notes?: string | null
          rating?: number | null
          last_cooked?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          created_at?: string
          notes?: string | null
          rating?: number | null
          last_cooked?: string | null
          tags?: string[] | null
        }
      }
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
          created_at: string
          updated_at: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
          category: string | null
        }
      }
    }
  }
}