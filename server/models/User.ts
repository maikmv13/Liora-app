import { db } from '../config/database';

export interface IUser {
  id: string;
  email: string;
  password: string;
  userType: 'user' | 'nutritionist';
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  static async findByEmail(email: string): Promise<IUser | null> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: string): Promise<IUser | null> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(user: Partial<IUser>): Promise<IUser> {
    const { data, error } = await db
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const { data, error } = await db
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getFavorites(userId: string) {
    const { data, error } = await db
      .from('favorites')
      .select(`
        *,
        recipes (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async addFavorite(userId: string, recipeId: string) {
    const { error } = await db
      .from('favorites')
      .insert([{ user_id: userId, recipe_id: recipeId }]);

    if (error) throw error;
  }

  static async removeFavorite(userId: string, recipeId: string) {
    const { error } = await db
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) throw error;
  }
}