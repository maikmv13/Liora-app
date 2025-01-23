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
          recipe_id,
          user_id,
          linked_household_id,
          recipes:recipe_id (*),
          profiles:user_id (
            id,
            full_name,
            user_type
          )
        `);

      // Si estamos en vista household y el usuario pertenece a un household
      if (isHouseholdView && profile?.linked_household_id) {
        query = query.eq('linked_household_id', profile.linked_household_id);
      } else {
        // Vista personal - solo mostrar favoritos del usuario
        query = query.eq('user_id', userId);
      }

      const { data: favoritesData, error: favoritesError } = await query;

      if (favoritesError) throw favoritesError;

      const transformedFavorites = favoritesData?.map(fav => ({
        ...fav.recipes,
        favorite_id: fav.id,
        created_at: fav.created_at,
        last_cooked: fav.last_cooked,
        notes: fav.notes,
        rating: fav.rating,
        tags: fav.tags,
        user_id: fav.user_id,
        linked_household_id: fav.linked_household_id,
        member_name: fav.profiles?.full_name
      })) || [];

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
            ? `linked_household_id=eq.${profile.linked_household_id}`
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
        linked_household_id: isHouseholdView ? profile?.linked_household_id : null,
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
        linked_household_id: data.linked_household_id
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
        // Si hay error, recargar los favoritos
        await fetchFavorites();
        throw error;
      }

    } catch (e) {
      console.error('Error removing favorite:', e);
      // En caso de error, recargar los favoritos
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