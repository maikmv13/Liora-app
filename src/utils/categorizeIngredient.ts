import { foodCategories } from '../data/categories';
import { Database } from '../types/supabase';

type IngredientCategory = Database['public']['Enums']['ingredient_category'];

export const categoryOrder: IngredientCategory[] = [
  'Carnicería',
  'Pescadería',
  'Charcutería',
  'Vegetales y Legumbres',
  'Frutas',
  'Frutos Secos',
  'Cereales y Derivados',
  'Lácteos, Huevos y Derivados',
  'Legumbres',
  'Líquidos y Caldos',
  'Condimentos y Especias',
  'Salsas y Aderezos',
  'Aceites',
  'Cafés e infusiones',
  'Confituras',
  'Otras Categorías'
];

export function categorizeIngredient(nombre: string): string {
  // Convertir el nombre a minúsculas para la comparación
  const nombreLower = nombre.toLowerCase();

  // Buscar en cada categoría
  for (const [categoria, ingredientes] of Object.entries(foodCategories)) {
    if (ingredientes.some(ing => nombreLower.includes(ing))) {
      return categoria;
    }
  }

  // Si no se encuentra en ninguna categoría, devolver 'Otros'
  return 'Otros';
}