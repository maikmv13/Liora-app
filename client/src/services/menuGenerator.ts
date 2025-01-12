import { Recipe, MenuItem } from '../types';

export function generateMenuForDay(
  recipes: Recipe[],
  meal: 'comida' | 'cena',
  existingMenu: MenuItem[]
): Recipe | null {
  const validRecipes = recipes.filter(recipe => {
    // Implementar reglas de selección:
    // 1. Categorías apropiadas para comida/cena
    // 2. No repetir recetas
    // 3. Balancear tipos de comida
    return true;
  });

  if (validRecipes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * validRecipes.length);
  return validRecipes[randomIndex];
} 