import { supabase } from '../lib/supabase';
import { MenuItem, MealType, Recipe } from '../types';
import { DAYS, WeekDay, DAY_MAPPING, MEAL_TYPES, MEAL_MAPPING } from '../components/WeeklyMenu2/constants';
import { generateShoppingList } from './shoppingList';

// Type definitions
export interface RecipeDB {
  id: string;
  name: string;
  calories: string;
  meal_type: MealType;
  side_dish: string | null;
  category: string;
  servings: number;
  prep_time?: string;
  instructions?: Record<string, string>;
  image_url?: string;
}

export interface WeeklyMenuBase {
  id: string;
  user_id: string;
  created_by: string;
  status: 'active' | 'archived';
  start_date: string;
  created_at: string;
  updated_at: string;
  [key: string]: string | null;
}

export interface ExtendedWeeklyMenuDB extends WeeklyMenuBase {
  recipes?: RecipeDB[];
  monday_breakfast: string | null;
  monday_lunch: string | null;
  monday_snack: string | null;
  monday_dinner: string | null;
  tuesday_breakfast: string | null;
  tuesday_lunch: string | null;
  tuesday_snack: string | null;
  tuesday_dinner: string | null;
  wednesday_breakfast: string | null;
  wednesday_lunch: string | null;
  wednesday_snack: string | null;
  wednesday_dinner: string | null;
  thursday_breakfast: string | null;
  thursday_lunch: string | null;
  thursday_snack: string | null;
  thursday_dinner: string | null;
  friday_breakfast: string | null;
  friday_lunch: string | null;
  friday_snack: string | null;
  friday_dinner: string | null;
  saturday_breakfast: string | null;
  saturday_lunch: string | null;
  saturday_snack: string | null;
  saturday_dinner: string | null;
  sunday_breakfast: string | null;
  sunday_lunch: string | null;
  sunday_snack: string | null;
  sunday_dinner: string | null;
  [key: string]: string | null | RecipeDB[] | undefined;
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
      .select()
      .eq('status', 'active')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
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

    const fieldName = `${dayKey}_${mealKey}`;
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
    const menuData: Record<string, any> = {};
    menuItems.forEach(item => {
      const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === item.day)?.[0];
      const mealKey = MEAL_MAPPING[item.meal];
      
      if (dayKey && mealKey) {
        const fieldName = `${dayKey}_${mealKey}`;
        menuData[fieldName] = item.recipe.id;
      }
    });

    // Create menu using stored procedure
    const { data: newMenu, error } = await supabase
      .rpc('create_weekly_menu', {
        p_user_id: userId,
        p_menu_data: menuData
      });

    if (error) throw error;
    if (!newMenu) throw new Error('Failed to create menu');

    // Generate shopping list
    const shoppingList = generateShoppingList(menuItems);

    // Insert shopping list items
    if (shoppingList.length > 0) {
      const shoppingListItems = shoppingList.map(item => ({
        user_id: userId,
        menu_id: newMenu.id,
        item_name: item.name,
        category: item.category || 'Otras Categorías',
        quantity: item.quantity,
        unit: item.unit,
        checked: false,
        days: item.days
      }));

      const { error: insertError } = await supabase
        .from('shopping_list_items')
        .upsert(shoppingListItems, {
          onConflict: 'user_id,menu_id,item_name',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error('Error inserting shopping list items:', insertError);
      }
    }

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
      .update({ status: 'archived' })
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