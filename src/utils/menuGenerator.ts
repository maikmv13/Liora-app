import { Recipe, MenuItem, MealType } from '../types';

// Reglas para la generación del menú
const mealRules = {
  comida: {
    allowedCategories: ['Aves', 'Carnes', 'Pastas y Arroces', 'Pescados', 'Legumbres'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 } // Solo permitido desde el jueves
    },
    weeklyLimits: {
      'Carnes': 3,
      'Pescados': 3
    }
  },
  cena: {
    allowedCategories: ['Ensaladas', 'Sopas y Cremas', 'Vegetariano', 'Pastas y Arroces'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 } // Solo permitido desde el jueves
    }
  }
};

// Categorías que se consideran proteínas
const proteinCategories = ['Aves', 'Carnes', 'Pescados', 'Legumbres'];

// Categorías saludables que deben aparecer al menos una vez por semana
const healthyCategories = ['Sopas y Cremas', 'Ensaladas', 'Vegetariano'];

interface MenuStats {
  categoryCount: Record<string, number>;
  consecutiveCategories: Record<string, number>;
  healthyCategoriesUsed: Set<string>;
  proteinMealsToday: number;
  weeklyLimitCount: Record<string, number>;
}

function isValidSelection(
  recipe: Recipe,
  mealType: MealType,
  day: string,
  dayIndex: number,
  stats: MenuStats,
  previousMenu: MenuItem[],
  lastCategory: string | null
): boolean {
  const rules = mealRules[mealType];

  // Verificar si la receta está marcada para el tipo de comida correcto
  if (recipe.Tipo !== mealType) {
    return false;
  }

  // Verificar si la categoría está permitida para este tipo de comida
  if (!rules.allowedCategories.includes(recipe.Categoria) &&
      !Object.keys(rules.restrictedCategories).includes(recipe.Categoria)) {
    return false;
  }

  // Verificar restricciones de Fast Food
  if (recipe.Categoria === 'Fast Food' && dayIndex < rules.restrictedCategories['Fast Food'].startDay) {
    return false;
  }

  // Verificar límites semanales para carnes y pescados
  if (mealType === 'comida' && rules.weeklyLimits && rules.weeklyLimits[recipe.Categoria] !== undefined) {
    if (stats.weeklyLimitCount[recipe.Categoria] >= rules.weeklyLimits[recipe.Categoria]) {
      return false;
    }
  }

  // Evitar repetir recetas del menú anterior
  if (previousMenu.some(item => item.recipe.Plato === recipe.Plato)) {
    return false;
  }

  // Evitar categorías consecutivas
  if (lastCategory === recipe.Categoria) {
    return false;
  }

  // Para cenas, verificar regla de proteínas
  if (mealType === 'cena' && stats.proteinMealsToday > 0 && proteinCategories.includes(recipe.Categoria)) {
    return false;
  }

  return true;
}

// ... resto del código del generador de menú se mantiene igual ...