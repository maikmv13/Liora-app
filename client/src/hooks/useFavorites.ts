import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FavoriteRecipe } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select(`
            *,
            recipe:recipes (
              *,
              recipe_ingredients (
                quantity,
                unit,
                ingredients (
                  name,
                  category
                )
              )
            )
          `);

        if (favoritesError) throw favoritesError;

        const convertedFavorites: FavoriteRecipe[] = (favoritesData || []).map(fav => ({
          ...fav.recipe,
          addedAt: fav.created_at,
          lastCooked: fav.last_cooked,
          notes: fav.notes,
          rating: fav.rating,
          tags: fav.tags
        }));

        setFavorites(convertedFavorites);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  const removeFavorite = async (recipe: FavoriteRecipe) => {
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('recipe_id', recipe.Plato);
      setFavorites(prev => prev.filter(f => f.Plato !== recipe.Plato));
    } catch (e) {
      console.error('Error removing favorite:', e);
    }
  };

  const updateFavorite = async (recipe: FavoriteRecipe) => {
    try {
      await supabase
        .from('favorites')
        .update({
          notes: recipe.notes,
          rating: recipe.rating,
          tags: recipe.tags,
          last_cooked: recipe.lastCooked
        })
        .eq('recipe_id', recipe.Plato);
      setFavorites(prev => prev.map(f => f.Plato === recipe.Plato ? recipe : f));
    } catch (e) {
      console.error('Error updating favorite:', e);
    }
  };

  return { favorites, loading, error, removeFavorite, updateFavorite };
} 