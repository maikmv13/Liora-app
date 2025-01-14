import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      console.log('Fetching recipes with ingredients...');
      
      // Fetch recipes with ingredients and their details
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            id,
            quantity,
            unit,
            ingredient_id,
            ingredients (
              id,
              name,
              category
            )
          )
        `);

      if (recipesError) throw recipesError;
      
      if (!recipesData || recipesData.length === 0) {
        console.log('No recipes found');
        setRecipes([]);
        return;
      }

      // Transform the data to match the Recipe type
      const transformedRecipes = recipesData.map(recipe => ({
        ...recipe,
        recipe_ingredients: recipe.recipe_ingredients?.map((ri: any) => ({
          ...ri,
          ingredients: ri.ingredients
        })) || []
      }));

      console.log('Transformed recipes:', transformedRecipes);
      setRecipes(transformedRecipes);
    } catch (e) {
      console.error('Error fetching recipes:', e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initFetch() {
      setLoading(true);
      await fetchRecipes();
      if (ignore) return;
    }

    initFetch();

    // Subscribe to changes
    const subscription = supabase
      .channel('recipes_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'recipes'
        },
        () => {
          if (!ignore) {
            console.log('Recipe changes detected, refreshing...');
            fetchRecipes();
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [fetchRecipes]);

  return { 
    recipes, 
    loading, 
    error, 
    refetch: fetchRecipes 
  };
}