import { foodCategories } from '../data/categories';

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