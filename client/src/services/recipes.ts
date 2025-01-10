import { supabase } from '../lib/supabase';
import type { Recipe } from '../types/recipes';

export const recipeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (*),
        instructions (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Recipe[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (*),
        instructions (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async create(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async update(id: string, updates: Partial<Recipe>) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};