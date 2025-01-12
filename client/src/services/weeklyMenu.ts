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
  lunes_desayuno: string | null;
  lunes_comida: string | null;
  lunes_snack: string | null;
  lunes_cena: string | null;
  martes_desayuno: string | null;
  martes_comida: string | null;
  martes_snack: string | null;
  martes_cena: string | null;
  miercoles_desayuno: string | null;
  miercoles_comida: string | null;
  miercoles_snack: string | null;
  miercoles_cena: string | null;
  jueves_desayuno: string | null;
  jueves_comida: string | null;
  jueves_snack: string | null;
  jueves_cena: string | null;
  viernes_desayuno: string | null;
  viernes_comida: string | null;
  viernes_snack: string | null;
  viernes_cena: string | null;
  sabado_desayuno: string | null;
  sabado_comida: string | null;
  sabado_snack: string | null;
  sabado_cena: string | null;
  domingo_desayuno: string | null;
  domingo_comida: string | null;
  domingo_snack: string | null;
  domingo_cena: string | null;
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

  // Agregar cada receta al menú
  menuItems.forEach(item => {
    const normalizedDay = item.day.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const fieldName = `${normalizedDay}_${item.meal}`;
    
    // Solo guardar el ID de la receta
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

  const { data, error } = await supabase
    .from('weekly_menus')
    .select(`
      *,
      lunes_desayuno(id, name, calories, meal_type, side_dish),
      lunes_comida(id, name, calories, meal_type, side_dish),
      lunes_snack(id, name, calories, meal_type, side_dish),
      lunes_cena(id, name, calories, meal_type, side_dish),
      martes_desayuno(id, name, calories, meal_type, side_dish),
      martes_comida(id, name, calories, meal_type, side_dish),
      martes_snack(id, name, calories, meal_type, side_dish),
      martes_cena(id, name, calories, meal_type, side_dish),
      miercoles_desayuno(id, name, calories, meal_type, side_dish),
      miercoles_comida(id, name, calories, meal_type, side_dish),
      miercoles_snack(id, name, calories, meal_type, side_dish),
      miercoles_cena(id, name, calories, meal_type, side_dish),
      jueves_desayuno(id, name, calories, meal_type, side_dish),
      jueves_comida(id, name, calories, meal_type, side_dish),
      jueves_snack(id, name, calories, meal_type, side_dish),
      jueves_cena(id, name, calories, meal_type, side_dish),
      viernes_desayuno(id, name, calories, meal_type, side_dish),
      viernes_comida(id, name, calories, meal_type, side_dish),
      viernes_snack(id, name, calories, meal_type, side_dish),
      viernes_cena(id, name, calories, meal_type, side_dish),
      sabado_desayuno(id, name, calories, meal_type, side_dish),
      sabado_comida(id, name, calories, meal_type, side_dish),
      sabado_snack(id, name, calories, meal_type, side_dish),
      sabado_cena(id, name, calories, meal_type, side_dish),
      domingo_desayuno(id, name, calories, meal_type, side_dish),
      domingo_comida(id, name, calories, meal_type, side_dish),
      domingo_snack(id, name, calories, meal_type, side_dish),
      domingo_cena(id, name, calories, meal_type, side_dish)
    `)
    .eq('status', 'active')
    .eq('user_id', userId || user.id)
    .order('created_at', { ascending: false })
    .single();

  if (error) throw error;
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
    .select(`
      *,
      lunes_desayuno(id, name, calories, meal_type, side_dish),
      lunes_comida(id, name, calories, meal_type, side_dish),
      lunes_snack(id, name, calories, meal_type, side_dish),
      lunes_cena(id, name, calories, meal_type, side_dish),
      martes_desayuno(id, name, calories, meal_type, side_dish),
      martes_comida(id, name, calories, meal_type, side_dish),
      martes_snack(id, name, calories, meal_type, side_dish),
      martes_cena(id, name, calories, meal_type, side_dish),
      miercoles_desayuno(id, name, calories, meal_type, side_dish),
      miercoles_comida(id, name, calories, meal_type, side_dish),
      miercoles_snack(id, name, calories, meal_type, side_dish),
      miercoles_cena(id, name, calories, meal_type, side_dish),
      jueves_desayuno(id, name, calories, meal_type, side_dish),
      jueves_comida(id, name, calories, meal_type, side_dish),
      jueves_snack(id, name, calories, meal_type, side_dish),
      jueves_cena(id, name, calories, meal_type, side_dish),
      viernes_desayuno(id, name, calories, meal_type, side_dish),
      viernes_comida(id, name, calories, meal_type, side_dish),
      viernes_snack(id, name, calories, meal_type, side_dish),
      viernes_cena(id, name, calories, meal_type, side_dish),
      sabado_desayuno(id, name, calories, meal_type, side_dish),
      sabado_comida(id, name, calories, meal_type, side_dish),
      sabado_snack(id, name, calories, meal_type, side_dish),
      sabado_cena(id, name, calories, meal_type, side_dish),
      domingo_desayuno(id, name, calories, meal_type, side_dish),
      domingo_comida(id, name, calories, meal_type, side_dish),
      domingo_snack(id, name, calories, meal_type, side_dish),
      domingo_cena(id, name, calories, meal_type, side_dish)
    `)
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
  // Primero, archivamos el menú activo actual
  await supabase
    .from('weekly_menus')
    .update({ status: 'archived' })
    .eq('status', 'active');

  // Luego, activamos el menú seleccionado
  const { error } = await supabase
    .from('weekly_menus')
    .update({ status: 'active' })
    .eq('id', menuId);

  if (error) throw error;
} 