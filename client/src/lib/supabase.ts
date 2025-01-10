import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
);

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  if (error.code === 'PGRST116') {
    return 'No se encontraron resultados';
  }
  if (error.code === 'auth/invalid-email') {
    return 'Email inválido';
  }
  if (error.code === 'auth/wrong-password') {
    return 'Contraseña incorrecta';
  }
  return error.message || 'Ha ocurrido un error';
};

// Tipos de usuario
export type UserType = 'user' | 'nutritionist';

// Interfaz para el perfil
export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  user_type: UserType;
  specialization?: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}

// Funciones helper para autenticación
export const auth = {
  signUp: async (email: string, password: string, userType: UserType, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType
        }
      }
    });

    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};

// Funciones helper para perfiles
export const profiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }
};

// Funciones helper para favoritos
export const favorites = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        recipes (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  add: async (userId: string, recipeId: string) => {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, recipe_id: recipeId }]);

    if (error) throw error;
  },

  remove: async (userId: string, recipeId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) throw error;
  }
};