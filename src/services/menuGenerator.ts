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
    allowedCategories: ['Aves', 'Carnes', 'Pastas y Arroces', 'Pescados', 'Legumbres', 'Vegetariano'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 }
    },
    weeklyLimits: {
      'Carnes': 3,
      'Pescados': 3
    }
  },
  cena: {
    allowedCategories: ['Ensaladas', 'Sopas y Cremas', 'Vegetariano', 'Pastas y Arroces', 'Pescados'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 }
    }
  },
  desayuno: {
    allowedCategories: ['Desayuno'],  // Solo permitir categoría Desayuno
    restrictedCategories: {
      'Fast Food': { startDay: 7 }
    }
  },
  snack: {
    allowedCategories: ['Snack'],  // Solo permitir categoría Snack
    restrictedCategories: {
      'Fast Food': { startDay: 7 }
    }
  }
};

function isValidSelection(
  recipe: Recipe,
  mealType: MealType,
  dayIndex: number,
  stats: MenuStats,
  previousMenu: MenuItem[],
  lastCategory: string | null
): boolean {
  const rules = mealRules[mealType];
  
  if (!recipe || !recipe.category) {
    return false;
  }

  // Para desayunos y snacks, solo permitir su categoría específica
  if ((mealType === 'desayuno' && recipe.category !== 'Desayuno') ||
      (mealType === 'snack' && recipe.category !== 'Snack')) {
    return false;
  }

  // Para otras comidas, verificar categorías permitidas
  if (mealType !== 'desayuno' && mealType !== 'snack') {
    const isAllowedCategory = rules.allowedCategories.includes(recipe.category);
    const isCompatibleCategory = recipe.meal_type === mealType;
    
    if (!isAllowedCategory && !isCompatibleCategory) {
      return false;
    }
  }

  // Check Fast Food restrictions
  if (recipe.category === 'Fast Food' && 
      rules.restrictedCategories && 
      dayIndex < rules.restrictedCategories['Fast Food'].startDay) {
    return false;
  }

  // Check weekly limits for meat and fish
  if (mealType === 'comida' && 
      rules.weeklyLimits && 
      (recipe.category === 'Carnes' || recipe.category === 'Pescados') &&
      stats.weeklyLimitCount[recipe.category] >= rules.weeklyLimits[recipe.category]) {
    return false;
  }

  // Avoid repeating recipes from previous menu
  if (previousMenu.some(item => item.recipe.id === recipe.id)) {
    return false;
  }

  // Avoid consecutive categories
  if (lastCategory === recipe.category) {
    return false;
  }

  return true;
}

export async function generateCompleteMenu(recipes: Recipe[]): Promise<MenuItem[]> {
  if (!recipes || recipes.length === 0) {
    throw new Error('No hay recetas disponibles para generar el menú');
  }

  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];
  const newMenu: MenuItem[] = [];
  const selectedRecipeIds = new Set<string>();
  const stats: MenuStats = {
    weeklyLimitCount: {},
    categoryCount: {},
    consecutiveCategories: {},
    healthyCategoriesUsed: new Set(),
    proteinMealsToday: 0
  };

  try {
    // Group recipes by meal type and category
    const recipesByMealType = recipes.reduce((acc, recipe) => {
      const mealType = recipe.meal_type || 'comida';
      if (!acc[mealType]) {
        acc[mealType] = [];
      }
      acc[mealType].push(recipe);
      return acc;
    }, {} as Record<MealType, Recipe[]>);

    // Add recipes to compatible meal types based on category
    for (const recipe of recipes) {
      // Para desayunos y snacks, solo añadir si coincide la categoría exacta
      if (recipe.category === 'Desayuno') {
        if (!recipesByMealType['desayuno']) {
          recipesByMealType['desayuno'] = [];
        }
        recipesByMealType['desayuno'].push(recipe);
      } else if (recipe.category === 'Snack') {
        if (!recipesByMealType['snack']) {
          recipesByMealType['snack'] = [];
        }
        recipesByMealType['snack'].push(recipe);
      } else {
        // Para otras comidas, mantener la lógica original
        for (const [mealType, rules] of Object.entries(mealRules)) {
          if (mealType !== 'desayuno' && mealType !== 'snack' && 
              rules.allowedCategories.includes(recipe.category)) {
            if (!recipesByMealType[mealType as MealType]) {
              recipesByMealType[mealType as MealType] = [];
            }
            if (!recipesByMealType[mealType as MealType].includes(recipe)) {
              recipesByMealType[mealType as MealType].push(recipe);
            }
          }
        }
      }
    }

    // Generate menu for each day and meal type
    for (const [dayIndex, day] of weekDays.entries()) {
      for (const meal of mealTypes) {
        const availableRecipes = recipesByMealType[meal] || [];
        
        if (availableRecipes.length === 0) {
          throw new Error(`No hay suficientes recetas para ${meal}. Añade más recetas de las siguientes categorías: ${mealRules[meal].allowedCategories.join(', ')}`);
        }

        // Filter valid recipes
        const validRecipes = availableRecipes.filter(recipe => 
          !selectedRecipeIds.has(recipe.id) &&
          isValidSelection(
            recipe,
            meal,
            dayIndex,
            stats,
            newMenu,
            newMenu[newMenu.length - 1]?.recipe.category
          )
        );

        // Select recipe
        let selectedRecipe: Recipe | null = null;
        if (validRecipes.length > 0) {
          selectedRecipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];
        } else {
          // If no valid recipes, try to reuse a recipe that hasn't been used recently
          const reusableRecipes = availableRecipes.filter(recipe => 
            !newMenu.slice(-3).some(item => item.recipe.id === recipe.id)
          );
          selectedRecipe = reusableRecipes[Math.floor(Math.random() * reusableRecipes.length)] || availableRecipes[0];
        }

        if (selectedRecipe) {
          selectedRecipeIds.add(selectedRecipe.id);
          
          // Update statistics
          if (selectedRecipe.category) {
            stats.weeklyLimitCount[selectedRecipe.category] = 
              (stats.weeklyLimitCount[selectedRecipe.category] || 0) + 1;
          }

          newMenu.push({
            day,
            meal,
            recipe: {
              ...selectedRecipe,
              meal_type: meal
            }
          });
        }
      }
    }

    if (newMenu.length === 0) {
      throw new Error('No se pudo generar el menú. No hay suficientes recetas disponibles.');
    }

    return newMenu;
  } catch (error) {
    console.error('Error generando el menú:', error);
    throw error;
  }
}