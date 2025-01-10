import { Recipe } from '../types';

// Reglas para la generación del menú
const mealRules = {
  comida: {
    categories: ['Carnes', 'Pescados', 'Pasta', 'Arroces'],
    maxRepetitions: {
      category: 2, // Máximo de veces que se puede repetir una categoría por semana
      recipe: 1,   // Máximo de veces que se puede repetir una receta por semana
    }
  },
  cena: {
    categories: ['Pescados', 'Vegetariano', 'Pasta', 'Ensaladas', 'Sopas'],
    maxRepetitions: {
      category: 2,
      recipe: 1,
    }
  }
};

interface MenuStats {
  categoryCount: Record<string, number>;
  recipeCount: Record<string, number>;
}

function initializeStats(): MenuStats {
  return {
    categoryCount: {},
    recipeCount: {}
  };
}

function updateStats(stats: MenuStats, recipe: Recipe): void {
  stats.categoryCount[recipe.Categoria] = (stats.categoryCount[recipe.Categoria] || 0) + 1;
  stats.recipeCount[recipe.Plato] = (stats.recipeCount[recipe.Plato] || 0) + 1;
}

function isValidSelection(
  recipe: Recipe,
  mealType: 'comida' | 'cena',
  stats: MenuStats
): boolean {
  const rules = mealRules[mealType];
  
  // Verificar si la categoría es válida para este tipo de comida
  if (!rules.categories.includes(recipe.Categoria)) {
    return false;
  }

  // Verificar límites de repetición
  if ((stats.categoryCount[recipe.Categoria] || 0) >= rules.maxRepetitions.category) {
    return false;
  }
  
  if ((stats.recipeCount[recipe.Plato] || 0) >= rules.maxRepetitions.recipe) {
    return false;
  }

  return true;
}

function getValidRecipes(
  recipes: Recipe[],
  mealType: 'comida' | 'cena',
  stats: MenuStats
): Recipe[] {
  return recipes.filter(recipe => isValidSelection(recipe, mealType, stats));
}

export async function generateWeeklyMenu(
  recipes: Recipe[],
  weekDays: string[],
  onAddToMenu: (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => void
): Promise<void> {
  const stats = initializeStats();

  // Generar nuevo menú
  for (const day of weekDays) {
    // Generar comida
    const validLunchRecipes = getValidRecipes(recipes, 'comida', stats);
    if (validLunchRecipes.length > 0) {
      const randomLunch = validLunchRecipes[Math.floor(Math.random() * validLunchRecipes.length)];
      updateStats(stats, randomLunch);
      onAddToMenu(randomLunch, day, 'comida');
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Generar cena
    const validDinnerRecipes = getValidRecipes(recipes, 'cena', stats);
    if (validDinnerRecipes.length > 0) {
      const randomDinner = validDinnerRecipes[Math.floor(Math.random() * validDinnerRecipes.length)];
      updateStats(stats, randomDinner);
      onAddToMenu(randomDinner, day, 'cena');
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}