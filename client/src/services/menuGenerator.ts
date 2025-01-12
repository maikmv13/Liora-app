import { Recipe, MenuItem, MealType } from '../types';

interface MenuRules {
  allowedCategories: string[];
  restrictedCategories?: {
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

const mealRules: Record<MealType, MenuRules> = {
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
  },
  desayuno: {
    allowedCategories: ['Cereales', 'Frutas', 'Lácteos'],
    restrictedCategories: {
      'Fast Food': { startDay: 7 }
    }
  },
  snack: {
    allowedCategories: ['Frutas', 'Nueces', 'Yogur'],
    restrictedCategories: {
      'Fast Food': { startDay: 7 }
    }
  }
};

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
  if (recipe.meal_type !== mealType) {
    return false;
  }

  // Verificar si la categoría está permitida para este tipo de comida
  if (!rules.allowedCategories.includes(recipe.category) &&
      !(rules.restrictedCategories && Object.keys(rules.restrictedCategories).includes(recipe.category))) {
    return false;
  }

  // Verificar restricciones de Fast Food
  if (recipe.category === 'Fast Food' && 
      rules.restrictedCategories && 
      dayIndex < rules.restrictedCategories['Fast Food'].startDay) {
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
  mealType: MealType,
  existingMenu: MenuItem[]
): Recipe | null {
  const validRecipes = recipes.filter(recipe => {
    const dayIndex = existingMenu.length / 2; // Asumiendo 2 comidas por día
    const lastMenuItem = existingMenu[existingMenu.length - 1];
    const lastCategory = lastMenuItem ? lastMenuItem.recipe.category : null;
    
    const stats: MenuStats = {
      weeklyLimitCount: {},
      categoryCount: {},
      consecutiveCategories: {},
      healthyCategoriesUsed: new Set(),
      proteinMealsToday: 0
    };

    return isValidSelection(
      recipe,
      mealType,
      new Date().toISOString(),
      dayIndex,
      stats,
      existingMenu,
      lastCategory
    );
  });

  if (validRecipes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * validRecipes.length);
  return validRecipes[randomIndex];
}

export async function generateCompleteMenu(recipes: Recipe[]): Promise<MenuItem[]> {
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const newMenu: MenuItem[] = [];
  const selectedRecipeIds = new Set<string>();

  for (const day of weekDays) {
    for (const meal of ['comida', 'cena', 'desayuno', 'snack'] as MealType[]) {
      const recipe = generateMenuForDay(
        recipes.filter(r => !selectedRecipeIds.has(r.id)),
        meal,
        newMenu
      );

      if (recipe) {
        selectedRecipeIds.add(recipe.id);
        newMenu.push({
          day,
          meal,
          recipe
        });
      }
    }
  }

  return newMenu;
} 