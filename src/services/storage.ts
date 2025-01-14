import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadRecipeImage(file: File, recipeId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${recipeId}.${fileExt}`;
    const filePath = `recipes/${fileName}`;

    const { error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteRecipeImage(recipeId: string) {
    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([`recipes/${recipeId}`]);

    if (error) throw error;
  }
};