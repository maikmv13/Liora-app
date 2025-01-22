import { Recipe, MenuItem, MealType } from '../types';
import { supabase } from '../lib/supabase';

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
    allowedCategories: ['Desayuno'],
    restrictedCategories: {
      'Fast Food': { startDay: 7 }
    }
  },
  snack: {
    allowedCategories: ['Snack'],
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

export async function generateCompleteMenu(
  recipes: Recipe[],
  userId: string,
  isHousehold: boolean
): Promise<MenuItem[]> {
  if (!recipes || recipes.length === 0) {
    throw new Error('Necesitas añadir algunas recetas a tus favoritos antes de generar un menú.');
  }

  try {
    // Verificar si el household existe si es necesario
    let householdId = null;
    if (isHousehold) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('household_id')
        .eq('user_id', userId)
        .single();

      if (!profile?.household_id) {
        throw new Error('No se encontró un household válido');
      }
      
      householdId = profile.household_id;
    }

    // Obtener favoritos según el contexto (household o personal)
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select(`
        recipes!favorites_recipe_id_fkey (*)
      `)
      .eq(isHousehold ? 'household_id' : 'user_id', isHousehold ? householdId : userId);

    if (favoritesError) throw favoritesError;

    const favoriteRecipes = favorites?.map(f => f.recipes) || [];
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];
    const newMenu: MenuItem[] = [];

    // Generar menú simple sin restricciones
    for (const day of weekDays) {
      for (const meal of mealTypes) {
        // Seleccionar una receta aleatoria
        const selectedRecipe = favoriteRecipes[Math.floor(Math.random() * favoriteRecipes.length)];
        
        if (selectedRecipe) {
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
      throw new Error('No hay suficientes recetas favoritas para generar un menú completo. ¡Añade más recetas a tus favoritos!');
    }

    return newMenu;

  } catch (error) {
    console.error('Error generando el menú:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Hubo un problema al generar el menú. Por favor, intenta de nuevo.');
  }
}