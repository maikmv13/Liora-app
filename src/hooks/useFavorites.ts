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

        console.log('Fetching favorites for user:', session.user.id);

        const { count, error: countError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);

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
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
          throw error;
        }

        if (!ignore) {
          console.log('Raw favorites data:', data);
          const transformedFavorites = data?.map(fav => ({
            ...fav.recipes,
            favorite_id: fav.id,
            created_at: fav.created_at,
            last_cooked: fav.last_cooked,
            notes: fav.notes,
            rating: fav.rating,
            tags: fav.tags
          })) as FavoriteRecipe[];

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
      if (!ignore) {
        fetchFavorites();
      }
    });

    const channel = supabase.channel('favorites_changes');
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites'
        },
        (payload) => {
          console.log('Favorites changed:', payload);
          if (!ignore) {
            fetchFavorites();
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      authSubscription.data.subscription.unsubscribe();
      subscription.unsubscribe();
    };
  }, []);

  const addFavorite = async (recipe: Recipe) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error('User must be authenticated to add favorites');
      }

      if (!session.access_token) {
        throw new Error('No access token available');
      }

      console.log('Current user:', session.user.id);
      console.log('Access token:', session.access_token.substring(0, 20) + '...');

      const { data: existing, error: checkError } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('recipe_id', recipe.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing favorite:', checkError);
        throw checkError;
      }

      if (existing) {
        console.log('Favorite already exists:', existing);
        return;
      }

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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error('User must be authenticated to remove favorites');
      }

      if (!session.access_token) {
        throw new Error('No access token available');
      }

      console.log('Current user:', session.user.id);
      console.log('Access token:', session.access_token.substring(0, 20) + '...');
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