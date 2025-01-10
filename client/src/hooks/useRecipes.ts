import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Recipe = Database['public']['Tables']['recipes']['Row'];

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
        setRecipes(data || []);
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