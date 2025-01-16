import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { FavoriteRecipe, Recipe } from '../types/recipe';

// Función auxiliar para validar UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchFavorites() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }

        if (!session?.user) {
          console.log('No active session found');
          setFavorites([]);
          setLoading(false);
          return;
        }

        const userId = session.user.id;
        if (!isValidUUID(userId)) {
          console.error('Invalid user ID:', userId);
          throw new Error('Invalid user ID');
        }

        console.log('Fetching favorites for user:', userId);

        const { count, error: countError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);

        if (countError) {
          console.error('Error checking favorites count:', countError);
          throw countError;
        }

        console.log('Found favorites count:', count);

        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            created_at,
            last_cooked,
            notes,
            rating,
            tags,
            recipe_id,
            recipes:recipe_id (*)
          `)
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching favorites:', error);
          throw error;
        }

        if (!ignore) {
          console.log('Raw favorites data:', data);
          const transformedFavorites = data?.map(fav => {
            if (!fav.recipes) {
              console.warn('Missing recipe data for favorite:', fav.id);
              return null;
            }
            return {
              ...fav.recipes,
              favorite_id: fav.id,
              created_at: fav.created_at,
              last_cooked: fav.last_cooked,
              notes: fav.notes,
              rating: fav.rating,
              tags: fav.tags
            };
          }).filter(Boolean) as FavoriteRecipe[];

          console.log('Transformed favorites:', transformedFavorites);
          setFavorites(transformedFavorites || []);
        }
      } catch (e) {
        console.error('Error in fetchFavorites:', e);
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

    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (!ignore && session?.user?.id) {
        fetchFavorites();
      }
    });

    return () => {
      ignore = true;
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  const addFavorite = async (recipe: Recipe) => {
    try {
      if (!recipe?.id || !isValidUUID(recipe.id)) {
        throw new Error('Invalid recipe ID');
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session?.user?.id || !isValidUUID(session.user.id)) {
        throw new Error('Invalid user session');
      }

      console.log('Adding favorite - User:', session.user.id, 'Recipe:', recipe.id);

      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: session.user.id,
          recipe_id: recipe.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Successfully added favorite:', data);

      setFavorites(prev => [...prev, { 
        ...recipe,
        favorite_id: data.id,
        created_at: data.created_at
      }]);

    } catch (e) {
      console.error('Error adding favorite:', e);
      throw e;
    }
  };

  const removeFavorite = async (recipe: FavoriteRecipe) => {
    try {
      console.log('Attempting to remove favorite:', recipe);
      
      if (!recipe) {
        throw new Error('Recipe object is required');
      }

      // Verificar si tenemos el ID del favorito
      const favoriteId = recipe.favorite_id;
      console.log('Favorite ID to remove:', favoriteId);

      if (!favoriteId) {
        // Intentar encontrar el favorito por recipe_id si no tenemos favorite_id
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          throw new Error('User must be authenticated');
        }

        console.log('Looking up favorite by recipe_id:', recipe.id);
        const { data: existingFavorite, error: lookupError } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('recipe_id', recipe.id)
          .single();

        if (lookupError || !existingFavorite) {
          console.error('Error looking up favorite:', lookupError);
          throw new Error('Could not find favorite to remove');
        }

        console.log('Found favorite by recipe_id:', existingFavorite);
        recipe.favorite_id = existingFavorite.id;
      }

      if (!isValidUUID(recipe.favorite_id)) {
        throw new Error(`Invalid favorite ID: ${recipe.favorite_id}`);
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session?.user?.id || !isValidUUID(session.user.id)) {
        throw new Error('Invalid user session');
      }

      console.log('Removing favorite:', recipe.favorite_id, 'for user:', session.user.id);

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', recipe.favorite_id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Successfully removed favorite');

      setFavorites(prev => prev.filter(f => f.favorite_id !== recipe.favorite_id));
    } catch (e) {
      console.error('Error removing favorite:', e);
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