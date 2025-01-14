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
          .select('*')
          .order('name');

        if (error) throw error;

        if (!ignore) {
          console.log('Transforming recipes once');
          setRecipes(data || []);
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching recipes:', e);
        if (!ignore) {
          setError(e as Error);
          setLoading(false);
        }
      }
    }

    fetchRecipes();

    // Configuramos la suscripción a cambios
    const channel = supabase.channel('recipes_changes');
    
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        () => {
          if (!ignore) {
            fetchRecipes();
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []); // Sin dependencias ya que no usamos variables externas

  return { recipes, loading, error };
}