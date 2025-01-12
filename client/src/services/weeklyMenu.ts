import { supabase } from '../lib/supabase';
import { MenuItem, MealType } from '../types';

// Definir los tipos necesarios
export interface WeeklyMenuDB {
  id: string;
  user_id: string;
  created_by: string;
  status: 'active' | 'archived';
  start_date: string;
  menu_items: MenuItem[];
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
  
  // Añadir log del token de sesión
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session token:', session?.access_token);

  console.log('Usuario actual:', user);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Error al obtener perfil:', profileError);
    // Crear perfil si no existe
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: user.email,
        user_type: 'user'
      });
    
    if (insertError) throw insertError;
  }

  console.log('Perfil del usuario:', profile);

  const targetUserId = (profile as Profile)?.user_type === 'nutritionist' 
    ? (forUserId || user.id) 
    : user.id;

  console.log('Datos a insertar:', {
    menu_items: menuItems,
    status: 'active',
    user_id: targetUserId,
    created_by: user.id
  });

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

  if (error) {
    console.error('Error al crear menú:', error);
    throw error;
  }

  return data as WeeklyMenuDB;
}

export async function getActiveMenu(userId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuario no autenticado');

  const query = supabase
    .from('weekly_menus')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (userId) {
    query.eq('user_id', userId);
  } else {
    query.eq('user_id', user.id);
  }

  const { data, error } = await query.single();
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
  return data as WeeklyMenuDB[];
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