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
  
  // Verificación básica del tipo de comida
  if (!recipe.meal_type || recipe.meal_type !== mealType) {
    return false;
  }

  // Si no hay reglas para este tipo de comida, permitir cualquier receta
  if (!rules) {
    return true;
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
  // Filtrar primero por tipo de comida
  const mealTypeRecipes = recipes.filter(recipe => recipe.meal_type === mealType);
  
  if (mealTypeRecipes.length === 0) {
    console.warn(`No hay recetas para el tipo de comida: ${mealType}`);
    return null;
  }

  const validRecipes = mealTypeRecipes.filter(recipe => {
    const dayIndex = Math.floor(existingMenu.length / 4); // 4 comidas por día
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

  if (validRecipes.length === 0) {
    // Si no hay recetas válidas, retornar cualquier receta del tipo correcto
    return mealTypeRecipes[Math.floor(Math.random() * mealTypeRecipes.length)];
  }
  
  return validRecipes[Math.floor(Math.random() * validRecipes.length)];
}

export async function generateCompleteMenu(recipes: Recipe[]): Promise<MenuItem[]> {
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];
  const newMenu: MenuItem[] = [];
  const selectedRecipeIds = new Set<string>();

  // Agrupar recetas por tipo de comida
  const recipesByMealType = recipes.reduce((acc, recipe) => {
    if (!acc[recipe.meal_type]) {
      acc[recipe.meal_type] = [];
    }
    acc[recipe.meal_type].push(recipe);
    return acc;
  }, {} as Record<MealType, Recipe[]>);

  // Generar menú para cada día y tipo de comida
  for (const day of weekDays) {
    for (const meal of mealTypes) {
      let recipe: Recipe | null = null;
      
      // Si no hay recetas para este tipo de comida, usar una receta de comida
      const availableRecipes = recipesByMealType[meal] || recipesByMealType['comida'];
      
      if (availableRecipes && availableRecipes.length > 0) {
        // Intentar encontrar una receta no usada
        const unusedRecipes = availableRecipes.filter(r => !selectedRecipeIds.has(r.id));
        if (unusedRecipes.length > 0) {
          recipe = unusedRecipes[Math.floor(Math.random() * unusedRecipes.length)];
        } else {
          // Si todas están usadas, usar cualquiera
          recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
        }
      }

      if (recipe) {
        selectedRecipeIds.add(recipe.id);
        newMenu.push({
          day,
          meal,
          recipe: {
            ...recipe,
            meal_type: meal // Forzar el tipo de comida correcto
          }
        });
      }
    }
  }

  return newMenu;
} 