import { db } from '../config/database';

export interface IRecipe {
  id: string;
  Plato: string;
  Acompañamiento: string;
  Tipo: 'comida' | 'cena';
  Categoria: string;
  Comensales: number;
  Ingredientes: Array<{
    Nombre: string;
    Cantidad: number;
    Unidad: string;
  }>;
  Calorias: string;
  Proteínas: string;
  Carbohidratos: string;
  Grasas: string;
  "Tiempo de preparación": string;
  Instrucciones: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export class Recipe {
  static async findAll(): Promise<IRecipe[]> {
    const { data, error } = await db
      .from('recipes')
      .select('*');

    if (error) throw error;
    return data;
  }

  static async findById(id: string): Promise<IRecipe | null> {
    const { data, error } = await db
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(recipe: Partial<IRecipe>): Promise<IRecipe> {
    const { data, error } = await db
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<IRecipe>): Promise<IRecipe | null> {
    const { data, error } = await db
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await db
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}