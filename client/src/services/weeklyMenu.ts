import { supabase } from '../lib/supabase';
import { MenuItem, MealType } from '../types';

// Definir los tipos necesarios
interface WeeklyMenuDB {
  id: string;
  user_id: string;
  created_by: string;
  status: 'active' | 'archived';
  start_date: string;
  menu_items: {
    recipe: {
      id: string;
      name: string;
      category: string;
      meal_type: MealType;
      // ... otros campos de Recipe que necesites
    };
    day: string;
    meal: MealType;
  }[];
  created_at: string;
  updated_at: string;
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
    .select('user_type')
    .eq('user_id', user.id)
    .single();

  const targetUserId = (profile as Profile)?.user_type === 'nutritionist' 
    ? (forUserId || user.id) 
    : user.id;

  const { data, error } = await supabase
    .from('weekly_menus')
    .insert({
      menu_items: menuItems,
      status: 'active',
      user_id: targetUserId,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data as WeeklyMenuDB;
}

export async function getActiveMenu(userId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const query = supabase
    .from('weekly_menus')
    .select('*')
    .eq('status', 'active');

  if (userId) {
    query.eq('user_id', userId);
  } else {
    query.eq('user_id', user.id);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as WeeklyMenuDB;
}

export async function archiveMenu(menuId: string | null) {
  if (!menuId) return;
  
  const { error } = await supabase
    .from('weekly_menus')
    .update({ status: 'archived' })
    .eq('id', menuId);

  if (error) throw error;
} 