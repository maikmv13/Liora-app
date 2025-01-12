import { Recipe, MenuItem } from '../types';

type DinnerMealType = 'comida' | 'cena';

interface MenuRules {
  allowedCategories: string[];
  restrictedCategories: {
    'Fast Food': { startDay: number; };
  };
  weeklyLimits?: {
    'Carnes': number;
    'Pescados': number;
  };
}

interface MenuStats {
  weeklyLimitCount: Record<string, number>;
  categoryCount: Record<string, number>;
  consecutiveCategories: Record<string, number>;
  healthyCategoriesUsed: Set<string>;
  proteinMealsToday: number;
}

const mealRules: Record<DinnerMealType, MenuRules> = {
  comida: {
    allowedCategories: ['Aves', 'Carnes', 'Pastas y Arroces', 'Pescados', 'Legumbres'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 }
    },
    weeklyLimits: {
      'Carnes': 3,
      'Pescados': 3
    }
  },
  cena: {
    allowedCategories: ['Ensaladas', 'Sopas y Cremas', 'Vegetariano', 'Pastas y Arroces'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 }
    }
  }
};

function isValidSelection(
  recipe: Recipe,
  mealType: DinnerMealType,
  day: string,
  dayIndex: number,
  stats: MenuStats,
  previousMenu: MenuItem[],
  lastCategory: string | null
): boolean {
  const rules = mealRules[mealType];

  // Verificar si la receta está marcada para el tipo de comida correcto
  if (recipe.meal_type !== mealType) {
    return false;
  }

  // Verificar si la categoría está permitida para este tipo de comida
  if (!rules.allowedCategories.includes(recipe.category) &&
      !Object.keys(rules.restrictedCategories).includes(recipe.category)) {
    return false;
  }

  // Verificar restricciones de Fast Food
  if (recipe.category === 'Fast Food' && dayIndex < rules.restrictedCategories['Fast Food'].startDay) {
    return false;
  }

  // Verificar límites semanales para carnes y pescados
  if (mealType === 'comida' && 
      rules.weeklyLimits && 
      (recipe.category === 'Carnes' || recipe.category === 'Pescados') &&
      stats.weeklyLimitCount[recipe.category] >= rules.weeklyLimits[recipe.category]) {
    return false;
  }

  // Evitar repetir recetas del menú anterior
  if (previousMenu.some(item => item.recipe.name === recipe.name)) {
    return false;
  }

  // Evitar categorías consecutivas
  if (lastCategory === recipe.category) {
    return false;
  }

  return true;
}

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