import { supabase } from '../lib/supabaseClient';
import type { Recipe, RecipeIngredient } from '../types';

export async function getRecipeIngredients(recipeName: string) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        id,
        name,
        recipe_ingredients (
          id,
          quantity,
          unit,
          ingredients (
            id,
            name,
            category
          )
        )
      `)
      .eq('name', recipeName)
      .single();

    if (error) throw error;
    
    if (!data) {
      throw new Error('Recipe not found');
    }

    // Transform the nested data structure
    const ingredients = data.recipe_ingredients?.map(ri => ({
      name: ri.ingredients?.name || '',
      quantity: ri.quantity,
      unit: ri.unit,
      category: ri.ingredients?.category || ''
    })) || [];

    return {
      recipeName: data.name,
      ingredients
    };

  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    throw error;
  }
}

export async function getRecipeWithIngredients(recipeId: string): Promise<Recipe> {
  const { data, error } = await supabase
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
    `)
    .eq('id', recipeId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Recipe not found');

  return {
    ...data,
    recipe_ingredients: data.recipe_ingredients?.map((ri: RecipeIngredient) => ({
      ...ri,
      ingredients: ri.ingredients
    })) || []
  };
}