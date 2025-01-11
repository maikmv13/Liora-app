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
          meal_type: "desayuno" | "comida" | "cena" | "snack"
          category: "Carnes" | "Pescados" | "Vegetariano" | "Pasta" | "Sopas" | "Ensaladas"
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
          image_url?: string | null
        }
        Insert: {
          id?: string
          name: string
          side_dish?: string | null
          meal_type: "desayuno" | "comida" | "cena" | "snack"
          category: "Carnes" | "Pescados" | "Vegetariano" | "Pasta" | "Sopas" | "Ensaladas"
          servings: number
          calories?: string | null
          energy_kj?: string | null
          fats?: string | null
          saturated_fats?: string | null
          carbohydrates?: string | null
          sugars?: string | null
          fiber?: string | null
          proteins?: string | null
          sodium?: string | null
          prep_time?: string | null
          instructions?: Json
          url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          side_dish?: string | null
          meal_type?: "desayuno" | "comida" | "cena" | "snack"
          category?: "Carnes" | "Pescados" | "Vegetariano" | "Pasta" | "Sopas" | "Ensaladas"
          servings?: number
          calories?: string | null
          energy_kj?: string | null
          fats?: string | null
          saturated_fats?: string | null
          carbohydrates?: string | null
          sugars?: string | null
          fiber?: string | null
          proteins?: string | null
          sodium?: string | null
          prep_time?: string | null
          instructions?: Json
          url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meal_type: "desayuno" | "comida" | "cena" | "snack"
      meal_category: "Carnes" | "Pescados" | "Vegetariano" | "Pasta" | "Sopas" | "Ensaladas"
    }
  }
}