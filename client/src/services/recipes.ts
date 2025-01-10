import { supabase } from '../lib/supabaseClient.ts';
import type { Recipe } from '../types';

export async function getRecipes(): Promise<Recipe[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients!inner (
        quantity,
        unit,
        ingredients!inner (
          name
        )
      )
    `);

  if (recipesError) throw recipesError;

  // Transformar los datos al formato esperado
  return recipes.map(recipe => ({
    ...recipe,
    ingredients: recipe.recipe_ingredients.map((ri: any) => ({
      name: ri.ingredients.name,
      quantity: ri.quantity,
      unit: ri.unit
    }))
  }));
}