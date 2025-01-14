import { supabase } from '../lib/supabase';
import type { MenuItem, MealType } from '../types';
import { DAY_MAPPING, MEAL_TYPES, MEAL_MAPPING } from '../components/WeeklyMenu2/constants';
import type { Database } from '../types/supabase';

// Definir tipos base de la base de datos
type WeeklyMenu = Database['public']['Tables']['weekly_menus']['Row'];
type WeeklyMenuUpdate = Database['public']['Tables']['weekly_menus']['Update'];
type WeeklyMenuInsert = Database['public']['Tables']['weekly_menus']['Insert'];
type Recipe = Database['public']['Tables']['recipes']['Row'];

// Tipos específicos de la aplicación
export interface RecipeDB extends Omit<Recipe, 'instructions'> {
  instructions?: Record<string, string>;
}

export interface ExtendedWeeklyMenuDB extends WeeklyMenu {
  monday_breakfast_recipe?: RecipeDB;
  monday_lunch_recipe?: RecipeDB;
  monday_snack_recipe?: RecipeDB;
  monday_dinner_recipe?: RecipeDB;
  tuesday_breakfast_recipe?: RecipeDB;
  tuesday_lunch_recipe?: RecipeDB;
  tuesday_snack_recipe?: RecipeDB;
  tuesday_dinner_recipe?: RecipeDB;
  wednesday_breakfast_recipe?: RecipeDB;
  wednesday_lunch_recipe?: RecipeDB;
  wednesday_snack_recipe?: RecipeDB;
  wednesday_dinner_recipe?: RecipeDB;
  thursday_breakfast_recipe?: RecipeDB;
  thursday_lunch_recipe?: RecipeDB;
  thursday_snack_recipe?: RecipeDB;
  thursday_dinner_recipe?: RecipeDB;
  friday_breakfast_recipe?: RecipeDB;
  friday_lunch_recipe?: RecipeDB;
  friday_snack_recipe?: RecipeDB;
  friday_dinner_recipe?: RecipeDB;
}

/**
 * Gets the active menu for a user
 */
export async function getActiveMenu(userId?: string): Promise<ExtendedWeeklyMenuDB | null> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        monday_breakfast_recipe:recipes(id, name, category, meal_type),
        monday_lunch_recipe:recipes(id, name, category, meal_type),
        monday_snack_recipe:recipes(id, name, category, meal_type),
        monday_dinner_recipe:recipes(id, name, category, meal_type),
        tuesday_breakfast_recipe:recipes(id, name, category, meal_type),
        tuesday_lunch_recipe:recipes(id, name, category, meal_type),
        tuesday_snack_recipe:recipes(id, name, category, meal_type),
        tuesday_dinner_recipe:recipes(id, name, category, meal_type),
        wednesday_breakfast_recipe:recipes(id, name, category, meal_type),
        wednesday_lunch_recipe:recipes(id, name, category, meal_type),
        wednesday_snack_recipe:recipes(id, name, category, meal_type),
        wednesday_dinner_recipe:recipes(id, name, category, meal_type),
        thursday_breakfast_recipe:recipes(id, name, category, meal_type),
        thursday_lunch_recipe:recipes(id, name, category, meal_type),
        thursday_snack_recipe:recipes(id, name, category, meal_type),
        thursday_dinner_recipe:recipes(id, name, category, meal_type),
        friday_breakfast_recipe:recipes(id, name, category, meal_type),
        friday_lunch_recipe:recipes(id, name, category, meal_type),
        friday_snack_recipe:recipes(id, name, category, meal_type),
        friday_dinner_recipe:recipes(id, name, category, meal_type)
      `)
      .eq('status', 'active' as const)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as ExtendedWeeklyMenuDB | null;
  } catch (error) {
    console.error('Error getting active menu:', error);
    return null;
  }
}

/**
 * Updates a specific recipe in the menu
 */
export async function updateMenuRecipe(
  menuId: string,
  day: string,
  meal: MealType,
  recipeId: string
): Promise<void> {
  try {
    const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === day)?.[0];
    const mealKey = MEAL_MAPPING[meal];
    
    if (!dayKey || !mealKey) {
      throw new Error('Invalid day or meal type');
    }

    const fieldName = `${dayKey}_${mealKey}` as keyof WeeklyMenuUpdate;
    const { error } = await supabase
      .from('weekly_menus')
      .update({ [fieldName]: recipeId })
      .eq('id',  );

    if (error) throw error;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}

/**
 * Removes a recipe from the menu
 */
export async function removeMenuRecipe(
  menuId: string,
  day: string,
  meal: MealType
): Promise<void> {
  try {
    const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === day)?.[0];
    const mealKey = MEAL_MAPPING[meal];
    
    if (!dayKey || !mealKey) {
      throw new Error('Invalid day or meal type');
    }

    const fieldName = `${dayKey}_${mealKey}`;
    const { error } = await supabase
      .from('weekly_menus')
      .update({ [fieldName]: null })
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing recipe:', error);
    throw error;
  }
}

/**
 * Creates a new weekly menu
 */
export async function createWeeklyMenu(menuItems: MenuItem[], userId?: string): Promise<ExtendedWeeklyMenuDB> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      userId = user.id;
    }

    // Prepare menu data
    const menuData: Partial<WeeklyMenuInsert> = {
      user_id: userId,
      created_by: userId,
      status: 'active',
      start_date: new Date().toISOString(),
    };

    menuItems.forEach(item => {
      const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === item.day)?.[0];
      const mealKey = MEAL_MAPPING[item.meal];
      
      if (dayKey && mealKey) {
        const fieldName = `${dayKey}_${mealKey}` as keyof WeeklyMenuInsert;
        menuData[fieldName] = item.recipe.id;
      }
    });

    const { data: newMenu, error } = await supabase
      .from('weekly_menus')
      .insert(menuData)
      .select()
      .single();

    if (error) throw error;
    if (!newMenu) throw new Error('Failed to create menu');

    return newMenu as ExtendedWeeklyMenuDB;
  } catch (error) {
    console.error('Error creating weekly menu:', error);
    throw error;
  }
}

/**
 * Archives an existing menu
 */
export async function archiveMenu(menuId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('weekly_menus')
      .update({ 
        status: 'archived' as WeeklyMenu['status'] 
      })
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error archiving menu:', error);
    throw error;
  }
}

/**
 * Gets the archived menu history
 */
export async function getMenuHistory(): Promise<ExtendedWeeklyMenuDB[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('weekly_menus')
      .select()
      .eq('user_id', user.id)
      .eq('status', 'archived')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting menu history:', error);
    return [];
  }
}

/**
 * Restores an archived menu as the active menu
 */
export async function restoreMenu(menuId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Archive current active menu
    await supabase
      .from('weekly_menus')
      .update({ status: 'archived' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    // Restore selected menu as active
    const { error } = await supabase
      .from('weekly_menus')
      .update({ status: 'active' })
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error restoring menu:', error);
    throw error;
  }
}

/**
 * Permanently deletes a menu
 */
export async function deleteMenu(menuId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('weekly_menus')
      .delete()
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
}

/**
 * Converts database menu to MenuItem array
 */
export async function convertDBToMenuItems(menu: ExtendedWeeklyMenuDB): Promise<MenuItem[]> {
  const menuItems: MenuItem[] = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'snack', 'dinner'];

  try {
    const recipeIds = Array.from(new Set(
      Object.entries(menu)
        .filter(([key, value]) => 
          days.some(day => key.startsWith(day)) && 
          value !== null && 
          typeof value === 'string'
        )
        .map(([_, value]) => value as string)
    ));

    if (recipeIds.length === 0) return menuItems;

    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds);

    if (error) throw error;
    if (!recipes) return menuItems;

    const recipeMap = new Map(recipes.map(recipe => [recipe.id, recipe]));

    for (const day of days) {
      for (const meal of meals) {
        const fieldName = `${day}_${meal}` as keyof ExtendedWeeklyMenuDB;
        const recipeId = menu[fieldName];
        
        if (typeof recipeId === 'string') {
          const recipe = recipeMap.get(recipeId);
          if (recipe) {
            menuItems.push({
              day: DAY_MAPPING[day],
              meal: MEAL_TYPES[meal as keyof typeof MEAL_TYPES],
              recipe
            });
          }
        }
      }
    }

    return menuItems;
  } catch (error) {
    console.error('Error converting menu items:', error);
    return menuItems;
  }
}