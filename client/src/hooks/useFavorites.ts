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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setFavorites([]);
          return;
        }

        const { data, error } = await supabase
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
          `)
          .eq('user_id', session.user.id);

        if (error) throw error;

        const convertedFavorites: FavoriteRecipe[] = (data || []).map(fav => ({
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

  const addFavorite = async (recipe: FavoriteRecipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          recipe_id: recipe.Plato,
          notes: recipe.notes,
          rating: recipe.rating,
          tags: recipe.tags,
          last_cooked: recipe.lastCooked
        });

      if (error) throw error;
      setFavorites(prev => [...prev, recipe]);
    } catch (e) {
      console.error('Error adding favorite:', e);
    }
  };

  const removeFavorite = async (recipe: FavoriteRecipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.Plato);

      if (error) throw error;
      setFavorites(prev => prev.filter(f => f.Plato !== recipe.Plato));
    } catch (e) {
      console.error('Error removing favorite:', e);
    }
  };

  const updateFavorite = async (recipe: FavoriteRecipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { error } = await supabase
        .from('favorites')
        .update({
          notes: recipe.notes,
          rating: recipe.rating,
          tags: recipe.tags,
          last_cooked: recipe.lastCooked
        })
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.Plato);

      if (error) throw error;
      setFavorites(prev => prev.map(f => f.Plato === recipe.Plato ? recipe : f));
    } catch (e) {
      console.error('Error updating favorite:', e);
    }
  };

  return { favorites, loading, error, addFavorite, removeFavorite, updateFavorite };
}