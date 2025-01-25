import { supabase } from '../lib/supabase';
import type { MenuItem, MealType } from '../types';
import { DAY_MAPPING, MEAL_MAPPING } from '../components/WeeklyMenu2/constants';
import type { Database } from '../types/supabase';

// Tipos base de la base de datos
type WeeklyMenu = Database['public']['Tables']['weekly_menus']['Row'];
type WeeklyMenuUpdate = Database['public']['Tables']['weekly_menus']['Update'];
type WeeklyMenuInsert = Database['public']['Tables']['weekly_menus']['Insert'];
type Recipe = Database['public']['Tables']['recipes']['Row'];

export interface ExtendedWeeklyMenuDB extends WeeklyMenu {
  recipes?: Recipe[];
}

export async function createWeeklyMenu(
  menuItems: MenuItem[], 
  userId: string,
  isHousehold: boolean,
  householdId: string | null = null
): Promise<ExtendedWeeklyMenuDB> {
  try {
    // Preparar datos del menú
    const menuData: Partial<WeeklyMenuInsert> = {
      created_by: userId,
      status: 'active',
      start_date: new Date().toISOString(),
    };

    // Asignar el ID correcto según el contexto
    if (isHousehold && householdId) {
      menuData.linked_household_id = householdId;
    } else {
      menuData.user_id = userId;
    }

    // Mapear items del menú a campos de la base de datos
    menuItems.forEach(item => {
      const dayKey = Object.entries(DAY_MAPPING).find(([_, value]) => value === item.day)?.[0];
      const mealKey = MEAL_MAPPING[item.meal];
      
      if (dayKey && mealKey) {
        const fieldName = `${dayKey}_${mealKey}_id` as keyof WeeklyMenuInsert;
        menuData[fieldName] = item.recipe.id;
      }
    });

    // Archivar menú activo existente
    await supabase
      .from('weekly_menus')
      .update({ status: 'archived' })
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId)
      .eq('status', 'active');

    // Crear nuevo menú
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
      .eq('id', menuId)
      .select();

    if (error) throw error;
  } catch (error) {
    console.error('Error updating menu recipe:', error);
    throw error;
  }
}

export async function getActiveMenu(
  userId?: string,
  isHousehold?: boolean
): Promise<ExtendedWeeklyMenuDB | null> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      userId = user.id;
    }

    // Obtener el perfil para verificar el household
    const { data: profile } = await supabase
      .from('profiles')
      .select('linked_household_id')
      .eq('user_id', userId)
      .single();

    const householdId = isHousehold ? profile?.linked_household_id : null;

    // Obtener el menú activo usando el ID correcto
    const { data: menu, error: menuError } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        monday_breakfast:monday_breakfast_id(*),
        monday_lunch:monday_lunch_id(*),
        monday_snack:monday_snack_id(*),
        monday_dinner:monday_dinner_id(*),
        tuesday_breakfast:tuesday_breakfast_id(*),
        tuesday_lunch:tuesday_lunch_id(*),
        tuesday_snack:tuesday_snack_id(*),
        tuesday_dinner:tuesday_dinner_id(*),
        wednesday_breakfast:wednesday_breakfast_id(*),
        wednesday_lunch:wednesday_lunch_id(*),
        wednesday_snack:wednesday_snack_id(*),
        wednesday_dinner:wednesday_dinner_id(*),
        thursday_breakfast:thursday_breakfast_id(*),
        thursday_lunch:thursday_lunch_id(*),
        thursday_snack:thursday_snack_id(*),
        thursday_dinner:thursday_dinner_id(*),
        friday_breakfast:friday_breakfast_id(*),
        friday_lunch:friday_lunch_id(*),
        friday_snack:friday_snack_id(*),
        friday_dinner:friday_dinner_id(*),
        saturday_breakfast:saturday_breakfast_id(*),
        saturday_lunch:saturday_lunch_id(*),
        saturday_snack:saturday_snack_id(*),
        saturday_dinner:saturday_dinner_id(*),
        sunday_breakfast:sunday_breakfast_id(*),
        sunday_lunch:sunday_lunch_id(*),
        sunday_snack:sunday_snack_id(*),
        sunday_dinner:sunday_dinner_id(*)
      `)
      .eq('status', 'active')
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId)
      .single();

    if (menuError) throw menuError;
    return menu;

  } catch (error) {
    console.error('Error getting active menu:', error);
    return null;
  }
}

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

export async function getMenuHistory(
  userId: string,
  isHousehold: boolean
): Promise<ExtendedWeeklyMenuDB[]> {
  try {
    // Obtener el perfil para verificar el household
    const { data: profile } = await supabase
      .from('profiles')
      .select('linked_household_id')
      .eq('user_id', userId)
      .single();

    const householdId = isHousehold ? profile?.linked_household_id : null;

    // Obtener los menús archivados
    const { data: menus, error: menusError } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        monday_breakfast:monday_breakfast_id(*),
        monday_lunch:monday_lunch_id(*),
        monday_snack:monday_snack_id(*),
        monday_dinner:monday_dinner_id(*),
        tuesday_breakfast:tuesday_breakfast_id(*),
        tuesday_lunch:tuesday_lunch_id(*),
        tuesday_snack:tuesday_snack_id(*),
        tuesday_dinner:tuesday_dinner_id(*),
        wednesday_breakfast:wednesday_breakfast_id(*),
        wednesday_lunch:wednesday_lunch_id(*),
        wednesday_snack:wednesday_snack_id(*),
        wednesday_dinner:wednesday_dinner_id(*),
        thursday_breakfast:thursday_breakfast_id(*),
        thursday_lunch:thursday_lunch_id(*),
        thursday_snack:thursday_snack_id(*),
        thursday_dinner:thursday_dinner_id(*),
        friday_breakfast:friday_breakfast_id(*),
        friday_lunch:friday_lunch_id(*),
        friday_snack:friday_snack_id(*),
        friday_dinner:friday_dinner_id(*),
        saturday_breakfast:saturday_breakfast_id(*),
        saturday_lunch:saturday_lunch_id(*),
        saturday_snack:saturday_snack_id(*),
        saturday_dinner:saturday_dinner_id(*),
        sunday_breakfast:sunday_breakfast_id(*),
        sunday_lunch:sunday_lunch_id(*),
        sunday_snack:sunday_snack_id(*),
        sunday_dinner:sunday_dinner_id(*)
      `)
      .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? householdId : userId)
      .eq('status', 'archived')
      .order('created_at', { ascending: false });

    if (menusError) throw menusError;
    return menus || [];

  } catch (error) {
    console.error('Error getting menu history:', error);
    return [];
  }
}