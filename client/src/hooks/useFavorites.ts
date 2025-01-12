import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FavoriteRecipe, Recipe } from '../types/recipe';

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
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from('favorites')
          .select('*, recipes(*)')
          .eq('user_id', session.user.id);

        if (data) {
          setFavorites(data.map(fav => ({
            ...fav.recipes,
            created_at: fav.created_at,
            last_cooked: fav.last_cooked,
            notes: fav.notes,
            rating: fav.rating,
            tags: fav.tags
          })) as FavoriteRecipe[] || []);
        } else {
          setFavorites([]);
        }
      } catch (e) {
        setError(e as Error);
        console.error('Error fetching favorites:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  const addFavorite = async (recipe: Recipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          recipe_id: recipe.id,
          created_at: new Date().toISOString(),
          notes: '',
          rating: 0,
          tags: [],
          last_cooked: null
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
      if (!session) throw new Error('No hay sesión activa');

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
      if (!session) throw new Error('No hay sesión activa');

      const { error } = await supabase
        .from('favorites')
        .update({
          notes: recipe.notes,
          rating: recipe.rating,
          tags: recipe.tags,
          last_cooked: recipe.last_cooked
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