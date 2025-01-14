import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FavoriteRecipe, Recipe } from '../types/recipe';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchFavorites() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setFavorites([]);
          return;
        }

        const { data, error } = await supabase
          .from('favorites')
          .select(`
            *,
            recipe:recipes!favorites_recipe_id_fkey (
              id,
              name,
              category,
              meal_type,
              servings,
              calories,
              prep_time,
              side_dish,
              instructions,
              image_url,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (!ignore) {
          const transformedFavorites = data?.map(fav => ({
            ...fav.recipe,
            created_at: fav.created_at,
            last_cooked: fav.last_cooked,
            notes: fav.notes,
            rating: fav.rating,
            tags: fav.tags
          })) as FavoriteRecipe[];

          setFavorites(transformedFavorites || []);
        }
      } catch (e) {
        console.error('Error fetching favorites:', e);
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchFavorites();

    const subscription = supabase.auth.onAuthStateChange(() => {
      fetchFavorites();
    });

    return () => {
      ignore = true;
      subscription.data.subscription.unsubscribe();
    };
  }, []);

  const addFavorite = async (recipe: Recipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User must be authenticated to add favorites');
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          recipe_id: recipe.id,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      const newFavorite: FavoriteRecipe = {
        ...recipe,
        created_at: new Date().toISOString(),
        last_cooked: null,
        notes: '',
        rating: 0,
        tags: []
      };

      setFavorites(prev => [...prev, newFavorite]);
    } catch (e) {
      console.error('Error adding favorite:', e);
      throw e;
    }
  };

  const removeFavorite = async (recipe: Recipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User must be authenticated to remove favorites');
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.id);

      if (error) throw error;
      setFavorites(prev => prev.filter(f => f.id !== recipe.id));
    } catch (e) {
      console.error('Error removing favorite:', e);
      throw e;
    }
  };

  const updateFavorite = async (recipe: FavoriteRecipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User must be authenticated to update favorites');
      }

      const { error } = await supabase
        .from('favorites')
        .update({
          notes: recipe.notes,
          rating: recipe.rating,
          tags: recipe.tags,
          last_cooked: recipe.last_cooked,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.id);

      if (error) throw error;
      setFavorites(prev => prev.map(f => f.id === recipe.id ? recipe : f));
    } catch (e) {
      console.error('Error updating favorite:', e);
      throw e;
    }
  };

  return { favorites, loading, error, addFavorite, removeFavorite, updateFavorite };
}