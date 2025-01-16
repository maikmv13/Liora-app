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
  recipes?: Recipe[];
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

    // Primero obtenemos el menú activo
    const { data: menu, error: menuError } = await supabase
      .from('weekly_menus')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (menuError) throw menuError;
    if (!menu) return null;

    // Obtenemos todas las recetas asociadas
    const recipeIds = Object.entries(menu)
      .filter(([key, value]) => 
        key.endsWith('_id') && 
        value !== null &&
        typeof value === 'string'
      )
      .map(([_, value]) => value as string);

    if (recipeIds.length > 0) {
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) throw recipesError;

      return {
        ...menu,
        recipes: recipes || []
      };
    }

    return menu;
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
  recipeId: string | null
): Promise<void> {
  try {
    const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === day)?.[0];
    const mealKey = MEAL_MAPPING[meal];
    
    if (!dayKey || !mealKey) {
      throw new Error('Invalid day or meal type');
    }

    const fieldName = `${dayKey}_${mealKey}_id` as keyof WeeklyMenuUpdate;
    const { error } = await supabase
      .from('weekly_menus')
      .update({ [fieldName]: recipeId })
      .eq('id', menuId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating recipe:', error);
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

    // Map menu items to database fields
    menuItems.forEach(item => {
      const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === item.day)?.[0];
      const mealKey = MEAL_MAPPING[item.meal];
      
      if (dayKey && mealKey) {
        const fieldName = `${dayKey}_${mealKey}_id` as keyof WeeklyMenuInsert;
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

    return newMenu;
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

    // Primero obtenemos los menús archivados
    const { data: menus, error: menusError } = await supabase
      .from('weekly_menus')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'archived')
      .order('created_at', { ascending: false });

    if (menusError) throw menusError;
    if (!menus || menus.length === 0) return [];

    // Obtenemos todas las recetas asociadas a todos los menús
    const recipeIds = menus.flatMap(menu => 
      Object.entries(menu)
        .filter(([key, value]) => 
          key.endsWith('_id') && 
          value !== null &&
          typeof value === 'string'
        )
        .map(([_, value]) => value as string)
    );

    if (recipeIds.length > 0) {
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) throw recipesError;

      // Añadir las recetas a cada menú
      return menus.map(menu => ({
        ...menu,
        recipes: recipes || []
      }));
    }

    return menus;
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