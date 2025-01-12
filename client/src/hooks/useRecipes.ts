import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        console.log('Iniciando fetch de recetas...');

        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients (
              id,
              ingredient_id,
              recipe_id,
              quantity,
              unit,
              ingredients (
                id,
                name,
                category
              )
            )
          `);

        if (error) throw error;
        
        if (!data || data.length === 0) {
          console.log('No se encontraron recetas en la base de datos');
          setRecipes([]);
          return;
        }

        // Convertir el formato de Supabase al formato esperado por la aplicación
        const convertedRecipes: Recipe[] = data.map(recipe => ({
          ...recipe,
          recipe_ingredients: recipe.recipe_ingredients?.map((ri) => ({
            ...ri,
            ingredients: ri.ingredients ? {
              id: ri.ingredients.id,
              name: ri.ingredients.name,
              category: ri.ingredients.category
            } : undefined
          })) || []
        }));

        setRecipes(convertedRecipes);
      } catch (e) {
        console.error('Error al obtener recetas:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return { recipes, loading, error };
}