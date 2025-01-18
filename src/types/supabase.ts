export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          last_cooked: string | null
          notes: string | null
          rating: number | null
          recipe_id: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_cooked?: string | null
          notes?: string | null
          rating?: number | null
          recipe_id: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_cooked?: string | null
          notes?: string | null
          rating?: number | null
          recipe_id?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["name"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: Database["public"]["Enums"]["ingredient_category"]
          id: string
          name: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["ingredient_category"]
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["ingredient_category"]
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          license_number: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          license_number?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          license_number?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          id: string
          ingredient_id: string | null
          quantity: number
          recipe_id: string | null
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Insert: {
          id?: string
          ingredient_id?: string | null
          quantity: number
          recipe_id?: string | null
          unit: Database["public"]["Enums"]["unit_type"]
        }
        Update: {
          id?: string
          ingredient_id?: string | null
          quantity?: number
          recipe_id?: string | null
          unit?: Database["public"]["Enums"]["unit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          calories: string | null
          carbohydrates: string | null
          category: Database["public"]["Enums"]["meal_category"]
          created_at: string | null
          energy_kj: string | null
          fats: string | null
          fiber: string | null
          id: string
          image_url: string | null
          instructions: Json
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          pdf_url: string | null
          prep_time: string | null
          proteins: string | null
          saturated_fats: string | null
          servings: number
          side_dish: string | null
          sodium: string | null
          sugars: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          calories?: string | null
          carbohydrates?: string | null
          category: Database["public"]["Enums"]["meal_category"]
          created_at?: string | null
          energy_kj?: string | null
          fats?: string | null
          fiber?: string | null
          id?: string
          image_url?: string | null
          instructions: Json
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          pdf_url?: string | null
          prep_time?: string | null
          proteins?: string | null
          saturated_fats?: string | null
          servings: number
          side_dish?: string | null
          sodium?: string | null
          sugars?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          calories?: string | null
          carbohydrates?: string | null
          category?: Database["public"]["Enums"]["meal_category"]
          created_at?: string | null
          energy_kj?: string | null
          fats?: string | null
          fiber?: string | null
          id?: string
          image_url?: string | null
          instructions?: Json
          meal_type?: Database["public"]["Enums"]["meal_type"]
          name?: string
          pdf_url?: string | null
          prep_time?: string | null
          proteins?: string | null
          saturated_fats?: string | null
          servings?: number
          side_dish?: string | null
          sodium?: string | null
          sugars?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      weekly_menus: {
        Row: {
          id: string;
          user_id: string;
          created_by: string;
          status: 'active' | 'archived';
          start_date: string;
          created_at: string;
          updated_at: string;
          monday_breakfast: string | null;
          monday_lunch: string | null;
          monday_snack: string | null;
          monday_dinner: string | null;
          tuesday_breakfast: string | null;
          tuesday_lunch: string | null;
          tuesday_snack: string | null;
          tuesday_dinner: string | null;
          wednesday_breakfast: string | null;
          wednesday_lunch: string | null;
          wednesday_snack: string | null;
          wednesday_dinner: string | null;
          thursday_breakfast: string | null;
          thursday_lunch: string | null;
          thursday_snack: string | null;
          thursday_dinner: string | null;
          friday_breakfast: string | null;
          friday_lunch: string | null;
          friday_snack: string | null;
          friday_dinner: string | null;
          saturday_breakfast: string | null;
          saturday_lunch: string | null;
          saturday_snack: string | null;
          saturday_dinner: string | null;
          sunday_breakfast: string | null;
          sunday_lunch: string | null;
          sunday_snack: string | null;
          sunday_dinner: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_by: string;
          status?: 'active' | 'archived';
          start_date: string;
          created_at?: string;
          updated_at?: string;
          monday_breakfast?: string | null;
          monday_lunch?: string | null;
          monday_snack?: string | null;
          monday_dinner?: string | null;
          tuesday_breakfast?: string | null;
          tuesday_lunch?: string | null;
          tuesday_snack?: string | null;
          tuesday_dinner?: string | null;
          wednesday_breakfast?: string | null;
          wednesday_lunch?: string | null;
          wednesday_snack?: string | null;
          wednesday_dinner?: string | null;
          thursday_breakfast?: string | null;
          thursday_lunch?: string | null;
          thursday_snack?: string | null;
          thursday_dinner?: string | null;
          friday_breakfast?: string | null;
          friday_lunch?: string | null;
          friday_snack?: string | null;
          friday_dinner?: string | null;
          saturday_breakfast?: string | null;
          saturday_lunch?: string | null;
          saturday_snack?: string | null;
          saturday_dinner?: string | null;
          sunday_breakfast?: string | null;
          sunday_lunch?: string | null;
          sunday_snack?: string | null;
          sunday_dinner?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_by?: string;
          status?: 'active' | 'archived';
          start_date?: string;
          created_at?: string;
          updated_at?: string;
          monday_breakfast?: string | null;
          monday_lunch?: string | null;
          monday_snack?: string | null;
          monday_dinner?: string | null;
          tuesday_breakfast?: string | null;
          tuesday_lunch?: string | null;
          tuesday_snack?: string | null;
          tuesday_dinner?: string | null;
          wednesday_breakfast?: string | null;
          wednesday_lunch?: string | null;
          wednesday_snack?: string | null;
          wednesday_dinner?: string | null;
          thursday_breakfast?: string | null;
          thursday_lunch?: string | null;
          thursday_snack?: string | null;
          thursday_dinner?: string | null;
          friday_breakfast?: string | null;
          friday_lunch?: string | null;
          friday_snack?: string | null;
          friday_dinner?: string | null;
          saturday_breakfast?: string | null;
          saturday_lunch?: string | null;
          saturday_snack?: string | null;
          saturday_dinner?: string | null;
          sunday_breakfast?: string | null;
          sunday_lunch?: string | null;
          sunday_snack?: string | null;
          sunday_dinner?: string | null;
        };
        Relationships: [];
      }
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp: string;
          session_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          role: 'user' | 'assistant';
          timestamp: string;
          session_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          timestamp?: string;
          session_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ingredient_category:
        | "Carnicería"
        | "Cereales y Derivados"
        | "Charcutería"
        | "Condimentos y Especias"
        | "Frutas"
        | "Frutos Secos"
        | "Ingredientes al gusto"
        | "Lácteos, Huevos y Derivados"
        | "Legumbres"
        | "Líquidos y Caldos"
        | "Otras Categorías"
        | "Pescadería"
        | "Salsas y Aderezos"
        | "Vegetales y Legumbres"
        | "Aceites"
        | "Cafés e infusiones"
        | "Confituras"
      meal_category:
        | "Aves"
        | "Carnes"
        | "Ensaladas"
        | "Fast Food"
        | "Legumbres"
        | "Pastas y Arroces"
        | "Pescados"
        | "Sopas y Cremas"
        | "Vegetariano"
        | "Desayuno"
        | "Huevos"
        | "Snack"
        | "Otros"
      meal_type: "desayuno" | "comida" | "cena" | "snack"
      unit_type:
        | "gramo"
        | "unidad"
        | "cucharadita"
        | "cucharada"
        | "mililitro"
        | "sobre"
        | "rebanada"
        | "vaso"
        | "pizca"
        | "litro"
        | "hoja"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
