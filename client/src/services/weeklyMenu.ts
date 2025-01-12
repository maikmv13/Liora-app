import { supabase } from '../lib/supabase';
import { MenuItem, MealType, Recipe } from '../types';

// Cambiar a export interface
export interface RecipeDB {
  id: string;
  name: string;
  calories: string;
  meal_type: MealType;
  side_dish: string | null;
}

// Definir los tipos necesarios
export interface WeeklyMenuDB {
  id: string;
  user_id: string;
  created_by: string;
  status: 'active' | 'archived';
  start_date: string;
  created_at: string;
  updated_at: string;
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
  [key: string]: string | null | Date;
}

interface Profile {
  user_id: string;
  user_type: 'user' | 'nutritionist';
}

export async function createWeeklyMenu(menuItems: MenuItem[], forUserId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const targetUserId = profile?.user_type === 'nutritionist' 
    ? (forUserId || user.id) 
    : user.id;

  // Convertir el menú al formato de la base de datos
  const menuData: Partial<WeeklyMenuDB> = {
    status: 'active',
    user_id: targetUserId,
    created_by: user.id
  };

  // Mapeo de días españoles a inglés
  const dayMapping: Record<string, string> = {
    'Lunes': 'monday',
    'Martes': 'tuesday',
    'Miércoles': 'wednesday',
    'Jueves': 'thursday',
    'Viernes': 'friday',
    'Sábado': 'saturday',
    'Domingo': 'sunday'
  };

  // Mapeo de comidas españolas a inglés
  const mealMapping: Record<string, string> = {
    'desayuno': 'breakfast',
    'comida': 'lunch',
    'snack': 'snack',
    'cena': 'dinner'
  };

  // Agregar cada receta al menú
  menuItems.forEach(item => {
    const day = dayMapping[item.day];
    const meal = mealMapping[item.meal];
    const fieldName = `${day}_${meal}`;
    menuData[fieldName] = item.recipe.id;
  });

  const { data, error } = await supabase
    .from('weekly_menus')
    .insert(menuData)
    .select()
    .single();

  if (error) {
    console.error('Error al crear menú:', error);
    throw error;
  }

  return data;
}

export async function getActiveMenu(userId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  // Primero, obtener el menú activo más reciente
  const { data, error } = await supabase
    .from('weekly_menus')
    .select('*')
    .eq('status', 'active')
    .eq('user_id', userId || user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Si hay un error, archivar todos los menús activos y retornar null
    await supabase
      .from('weekly_menus')
      .update({ status: 'archived' })
      .eq('user_id', userId || user.id)
      .eq('status', 'active');
    
    return null;
  }

  return data;
}

export async function archiveMenu(menuId: string | null) {
  if (!menuId) return;
  
  const { error } = await supabase
    .from('weekly_menus')
    .update({ status: 'archived' })
    .eq('id', menuId);

  if (error) throw error;
}

export async function getMenuHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await supabase
    .from('weekly_menus')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteMenu(menuId: string) {
  const { error } = await supabase
    .from('weekly_menus')
    .delete()
    .eq('id', menuId);

  if (error) throw error;
}

export async function restoreMenu(menuId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  // Primero, archivamos todos los menús activos
  await supabase
    .from('weekly_menus')
    .update({ status: 'archived' })
    .eq('user_id', user.id)
    .eq('status', 'active');

  // Luego, activamos el menú seleccionado
  const { error } = await supabase
    .from('weekly_menus')
    .update({ status: 'active' })
    .eq('id', menuId);

  if (error) throw error;
} 