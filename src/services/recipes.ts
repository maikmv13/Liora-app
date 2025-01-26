import { supabase } from '../lib/supabase';
import type { Recipe, RecipeIngredient, MealCategory, MealType } from '../types';

// Definir las categorías válidas
const VALID_CATEGORIES: MealCategory[] = [
  'Legumbres',
  'Aves',
  'Carnes',
  'Ensaladas',
  'Fast Food',
  'Pastas y Arroces',
  'Pescados',
  'Sopas y Cremas',
  'Vegetariano',
  'Desayuno',
  'Huevos',
  'Snack',
  'Otros'
];

const VALID_MEAL_TYPES: MealType[] = [
  'desayuno',
  'comida',
  'cena',
  'snack'
];

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
      name: ri.ingredient?.name || '',
      quantity: ri.quantity,
      unit: ri.unit,
      category: ri.ingredient?.category || ''
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

export async function getRecipes() {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          name,
          category
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return recipes as Recipe[];
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    // Normalizar la consulta y eliminar palabras comunes
    const searchTerms = query.toLowerCase()
      .split(' ')
      .filter(term => 
        term.length > 2 && 
        !['una', 'un', 'el', 'la', 'los', 'las', 'para', 'con'].includes(term)
      );
    
    // Separar términos válidos para categorías y tipos de comida
    const categoryTerms = searchTerms.filter(term => 
      VALID_CATEGORIES.some(cat => cat.toLowerCase() === term)
    );
    const mealTypeTerms = searchTerms.filter(term => 
      VALID_MEAL_TYPES.some(type => type.toLowerCase() === term)
    );
    
    // Construir la consulta
    const baseQuery = supabase
      .from('recipes')
      .select(`
        *,
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
      `);

    // Añadir filtros
    const filters: string[] = [];

    // Búsqueda por nombre (usando todos los términos)
    searchTerms.forEach(term => {
      filters.push(`name.ilike.%${term}%`);
    });

    // Búsqueda por categoría (solo términos válidos)
    categoryTerms.forEach(term => {
      const validCategory = VALID_CATEGORIES.find(
        cat => cat.toLowerCase() === term
      );
      if (validCategory) {
        filters.push(`category.eq.${validCategory}`);
      }
    });

    // Búsqueda por tipo de comida (solo términos válidos)
    mealTypeTerms.forEach(term => {
      const validType = VALID_MEAL_TYPES.find(
        type => type.toLowerCase() === term
      );
      if (validType) {
        filters.push(`meal_type.eq.${validType}`);
      }
    });

    // Aplicar los filtros
    const { data: recipes, error } = await (filters.length > 0 
      ? baseQuery.or(filters.join(',')).limit(5)
      : baseQuery.limit(5));

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    if (!recipes) {
      return [];
    }

    // Calcular relevancia
    const scoredRecipes = recipes.map(recipe => {
      let score = 0;
      searchTerms.forEach(term => {
        // Coincidencia en nombre
        if (recipe.name.toLowerCase().includes(term)) score += 3;
        
        // Coincidencia exacta en categoría
        if (recipe.category.toLowerCase() === term) score += 4;
        
        // Coincidencia exacta en tipo de comida
        if (recipe.meal_type.toLowerCase() === term) score += 4;
        
        // Coincidencia en ingredientes
        recipe.recipe_ingredients?.forEach((ri: RecipeIngredient) => {
          if (ri.ingredient?.name.toLowerCase().includes(term)) score += 2;
        });
      });
      
      return { recipe, score };
    });

    return scoredRecipes
      .sort((a, b) => b.score - a.score)
      .map(({ recipe }) => recipe)
      .filter(recipe => recipe.recipe_ingredients?.length > 0);

  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}