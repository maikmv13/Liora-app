import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types/recipe';
import { MOCK_RECIPES } from '../data/mockData';

export function useRecipes(weeklyMenu: any | null = null) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchRecipes() {
      try {
        // En modo showcase, usamos mock data directamente para evitar cuelgues de red
        const isPlaceholder = true; // Showcase Mode VITE_SUPABASE_URL

        if (isPlaceholder && !weeklyMenu) {
          setRecipes(MOCK_RECIPES as any);
          setLoading(false);
          return;
        }

        if (!weeklyMenu) {
          // Si no hay menú, obtenemos todas las recetas
          const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .order('name', { ascending: true });

          if (error) throw error;

          if (!ignore) {
            let transformedRecipes = data?.map(recipe => ({
              ...recipe,
              description: Array.isArray(recipe.instructions)
                ? recipe.instructions[0]
                : typeof recipe.instructions === 'object'
                  ? (recipe.instructions as any).description || ''
                  : '',
              inHouseholdMenu: false
            })) || [];

            // Fallback a MOCK_RECIPES si no hay datos en Supabase
            if (transformedRecipes.length === 0) {
              transformedRecipes = MOCK_RECIPES as any;
            }

            setRecipes(transformedRecipes as any);
          }
          return;
        }

        // Si hay menú, obtenemos las recetas del menú
        const recipeIds = [
          weeklyMenu.monday_breakfast_id,
          weeklyMenu.monday_lunch_id,
          weeklyMenu.monday_dinner_id,
          weeklyMenu.tuesday_breakfast_id,
          weeklyMenu.tuesday_lunch_id,
          weeklyMenu.tuesday_dinner_id
          // Agregar más días según sea necesario
        ].filter(Boolean);

        if (recipeIds.length === 0) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('recipes')
          .select(`
            id,
            name,
            instructions,
            meal_type,
            category,
            image_url,
            prep_time,
            servings,
            calories,
            carbohydrates,
            proteins,
            fats
          `)
          .in('id', recipeIds)
          .order('name', { ascending: true });

        if (error) throw error;

        if (!ignore) {
          const transformedRecipes = data?.map(recipe => ({
            ...recipe,
            description: Array.isArray(recipe.instructions)
              ? recipe.instructions[0]
              : typeof recipe.instructions === 'object'
                ? (recipe.instructions as any).description || ''
                : '',
            inHouseholdMenu: Boolean(weeklyMenu.linked_household_id)
          })) || [];

          setRecipes(transformedRecipes as any);
        }
      } catch (e) {
        console.error('Error fetching recipes:', e);
        if (!ignore) {
          setError(e as Error);
          // Fallback final a mock data en caso de error crítico de red
          setRecipes(MOCK_RECIPES as any);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecipes();
    return () => { ignore = true; };
  }, [weeklyMenu]);

  return { recipes, loading, error };
}