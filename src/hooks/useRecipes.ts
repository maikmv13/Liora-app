import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types/recipe';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchRecipes() {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            id,
            name,
            instructions,
            meal_type,
            category,
            image_url,
            prep_time,
            servings,
            calories,
            carbohydrates,
            proteins,
            fats
          `)
          .order('name');

        if (error) throw error;

        if (!ignore) {
          // Transformar los datos para incluir la descripción desde las instrucciones
          const transformedRecipes = data?.map(recipe => ({
            ...recipe,
            description: Array.isArray(recipe.instructions) 
              ? recipe.instructions[0] 
              : typeof recipe.instructions === 'object' 
                ? recipe.instructions.description || ''
                : ''
          })) || [];

          setRecipes(transformedRecipes);
        }
      } catch (e) {
        console.error('Error fetching recipes:', e);
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();
    return () => { ignore = true; };
  }, []);

  return { recipes, loading, error };
}