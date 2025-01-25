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
  try {
    // 1. Obtener el contexto (household o personal)
    let householdId = null;
    if (isHousehold) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profile?.linked_household_id) {
        throw new Error('No se encontró un household válido');
      }
      householdId = profile.linked_household_id;
    }

    // 2. Obtener recetas favoritas según el contexto
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select(`
        recipe_id,
        recipes:recipe_id (*)
      `)
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId);

    if (favoritesError) throw favoritesError;

    // 3. Procesar recetas favoritas evitando duplicados
    const uniqueFavorites = Array.from(
      new Map(
        favorites
          ?.map(f => f.recipes)
          .filter(Boolean)
          .map(recipe => [recipe.id, recipe])
      ).values()
    );

    if (uniqueFavorites.length === 0) {
      throw new Error(
        isHousehold 
          ? 'No hay suficientes recetas favoritas en el hogar. ¡Añadan más recetas favoritas!'
          : 'Necesitas añadir algunas recetas a tus favoritos antes de generar un menú.'
      );
    }

    // 4. Generar el menú
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];
    const newMenu: MenuItem[] = [];
    const stats: MenuStats = {
      weeklyLimitCount: {},
      categoryCount: {},
      consecutiveCategories: {},
      healthyCategoriesUsed: new Set(),
      proteinMealsToday: 0
    };

    for (const day of weekDays) {
      for (const meal of mealTypes) {
        let validRecipes = uniqueFavorites.filter(recipe => 
          isValidSelection(
            recipe,
            meal,
            weekDays.indexOf(day),
            stats,
            newMenu,
            newMenu[newMenu.length - 1]?.recipe.category || null
          )
        );

        if (validRecipes.length === 0) {
          validRecipes = uniqueFavorites.filter(r => r.meal_type === meal);
        }

        if (validRecipes.length > 0) {
          const selectedRecipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];
          
          // Actualizar estadísticas
          if (selectedRecipe.category) {
            stats.categoryCount[selectedRecipe.category] = 
              (stats.categoryCount[selectedRecipe.category] || 0) + 1;
            
            if (['Carnes', 'Pescados'].includes(selectedRecipe.category)) {
              stats.weeklyLimitCount[selectedRecipe.category] = 
                (stats.weeklyLimitCount[selectedRecipe.category] || 0) + 1;
            }
          }

          newMenu.push({
            day,
            meal,
            recipe: selectedRecipe
          });
        }
      }
    }

    if (newMenu.length === 0) {
      throw new Error(
        isHousehold
          ? 'No se pudo generar un menú completo para el hogar. Revisen sus recetas favoritas.'
          : 'No hay suficientes recetas para generar un menú completo. ¡Añade más recetas a tus favoritos!'
      );
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