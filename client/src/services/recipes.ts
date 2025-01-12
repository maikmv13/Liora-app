import { supabase } from '../lib/supabaseClient.ts';
import type { Recipe } from '../types';

export async function getRecipes(): Promise<Recipe[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        id,
        ingredient_id,
        recipe_id,
        quantity,
        unit,
        ingredients (
          id,
          name,
          category
        )
      )
    `);

  if (recipesError) throw recipesError;

  return recipes.map(recipe => ({
    ...recipe,
    recipe_ingredients: recipe.recipe_ingredients?.map((ri) => ({
      id: ri.id,
      ingredient_id: ri.ingredient_id,
      recipe_id: ri.recipe_id,
      quantity: ri.quantity,
      unit: ri.unit,
      ingredients: ri.ingredients || undefined
    })) || []
  }));
}