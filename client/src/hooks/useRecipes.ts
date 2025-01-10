import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import type { Recipe } from '../types';

type SupabaseRecipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeIngredient {
  quantity: number;
  unit: string;
  ingredients: {
    name: string;
    category?: string;
  };
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients (
              quantity,
              unit,
              ingredients (
                name
              )
            )
          `);

        if (error) throw error;
        
        // Convertir el formato de Supabase al formato esperado por la aplicación
        const convertedRecipes: Recipe[] = (data || []).map(recipe => ({
          Plato: recipe.name,
          Acompañamiento: recipe.side_dish || '',
          Tipo: recipe.meal_type,
          Categoria: recipe.category,
          Comensales: recipe.servings,
          Ingredientes: recipe.recipe_ingredients?.map((ri: RecipeIngredient) => ({
            Nombre: ri.ingredients.name,
            Cantidad: ri.quantity,
            Unidad: ri.unit,
            Categoria: ri.ingredients.category || 'Otros'
          })) || [],
          Calorias: recipe.calories || '0',
          "Valor energético (kJ)": recipe.energy_kj || '0',
          Grasas: recipe.fats || '0',
          Saturadas: recipe.saturated_fats || '0',
          Carbohidratos: recipe.carbohydrates || '0',
          Azúcares: recipe.sugars || '0',
          Fibra: recipe.fiber || '0',
          Proteínas: recipe.proteins || '0',
          Sodio: recipe.sodium || '0',
          "Tiempo de preparación": recipe.prep_time || '30',
          Instrucciones: recipe.instructions as any,
          Url: recipe.url || '',
          PDF_Url: recipe.pdf_url || ''
        }));

        setRecipes(convertedRecipes);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
}