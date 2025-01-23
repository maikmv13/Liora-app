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
          .select('id, name, description, meal_type, category')
          .order('name');

        if (error) throw error;

        if (!ignore) {
          setRecipes(data || []);
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