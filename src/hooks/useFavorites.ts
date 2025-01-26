import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FavoriteRecipe } from '../types';
import { useActiveProfile } from './useActiveProfile';

export function useFavorites(isHouseholdView?: boolean) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { id: userId, profile } = useActiveProfile();

  const fetchFavorites = async () => {
    try {
      if (!userId) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          last_cooked,
          notes,
          rating,
          tags,
          user_id,
          recipe_id,
          recipes (
            *
          ),
          profiles (
            id,
            full_name,
            user_type,
            linked_household_id
          )
        `);

      // Si estamos en vista household y el usuario pertenece a un household
      if (isHouseholdView && profile?.linked_household_id) {
        query = query.eq('profiles.linked_household_id', profile.linked_household_id);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data: favoritesData, error: favoritesError } = await query;

      if (favoritesError) throw favoritesError;

      console.log('Raw favorites data:', favoritesData?.[0]);

      const transformedFavorites = favoritesData?.map(fav => ({
        ...fav.recipes,
        favorite_id: fav.id,
        created_at: fav.created_at,
        last_cooked: fav.last_cooked,
        notes: fav.notes,
        rating: fav.rating,
        tags: fav.tags,
        user_id: fav.user_id,
        member_name: fav.profiles?.full_name,
        recipe_id: fav.recipe_id
      })) || [];

      console.log('Transformed favorites:', transformedFavorites);
      setFavorites(transformedFavorites);
      setLoading(false);
      setError(null);

    } catch (e) {
      console.error('Error fetching favorites:', e);
      setError(e as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();

    // Suscribirse a cambios en tiempo real
    const channel = supabase.channel('favorites_changes');
    
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: isHouseholdView && profile?.linked_household_id
            ? `profiles.linked_household_id=eq.${profile.linked_household_id}`
            : `user_id=eq.${userId}`
        },
        () => fetchFavorites()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, isHouseholdView, profile?.linked_household_id]);

  const addFavorite = async (recipe: FavoriteRecipe) => {
    try {
      if (!userId) throw new Error('No authenticated user');

      const favoriteData = {
        user_id: userId,
        recipe_id: recipe.id,
        created_at: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert(favoriteData)
        .select()
        .single();

      if (insertError) throw insertError;

      const transformedFavorite = {
        ...recipe,
        favorite_id: data.id,
        created_at: data.created_at,
        user_id: data.user_id
      };

      setFavorites(prev => [...prev, transformedFavorite]);

    } catch (e) {
      console.error('Error adding favorite:', e);
      throw e;
    }
  };

  const removeFavorite = async (recipe: FavoriteRecipe) => {
    try {
      if (!recipe.favorite_id) {
        throw new Error('No favorite ID provided');
      }

      // Actualizar el estado inmediatamente para la UI
      setFavorites(prev => 
        prev.filter(f => f.favorite_id !== recipe.favorite_id)
      );

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', recipe.favorite_id);

      if (error) {
        await fetchFavorites();
        throw error;
      }

    } catch (e) {
      console.error('Error removing favorite:', e);
      await fetchFavorites();
      throw e;
    }
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite
  };
}