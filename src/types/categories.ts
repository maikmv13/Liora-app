import { MealType } from '.';
import { supabase } from '../lib/supabase';

// Static categories for immediate use while loading from Supabase
export const categories = [
  { id: 'Todas', label: 'Todas', emoji: '🍽️' },
  { id: 'Aves', label: 'Aves', emoji: '🍗' },
  { id: 'Carnes', label: 'Carnes', emoji: '🥩' },
  { id: 'Ensaladas', label: 'Ensaladas', emoji: '🥗' },
  { id: 'Fast Food', label: 'Fast Food', emoji: '🍔' },
  { id: 'Legumbres', label: 'Legumbres', emoji: '🫘' },
  { id: 'Pastas y Arroces', label: 'Pastas y Arroces', emoji: '🍝' },
  { id: 'Pescados', label: 'Pescados', emoji: '🐟' },
  { id: 'Sopas y Cremas', label: 'Sopas y Cremas', emoji: '🥣' },
  { id: 'Vegetariano', label: 'Vegetariano', emoji: '🥬' },
  { id: 'Desayuno', label: 'Desayuno', emoji: '🍳' },
  { id: 'Huevos', label: 'Huevos', emoji: '🥚' },
  { id: 'Snack', label: 'Snack', emoji: '🥨' },
  { id: 'Otros', label: 'Otros', emoji: '🍽️' }
];

// Meal type specific categories
export const mealTypeCategories: Record<MealType, string[]> = {
  desayuno: ['Desayuno', 'Huevos', 'Vegetariano'],
  comida: ['Aves', 'Carnes', 'Pescados', 'Pastas y Arroces', 'Legumbres', 'Vegetariano'],
  snack: ['Snack', 'Vegetariano', 'Otros'],
  cena: ['Ensaladas', 'Sopas y Cremas', 'Pescados', 'Vegetariano', 'Pastas y Arroces']
};

// Meal types configuration
export const mealTypes = [
  { id: 'desayuno' as const, label: 'Desayuno', emoji: '🍳', requiredRecipes: 2 },
  { id: 'comida' as const, label: 'Comida', emoji: '🍽️', requiredRecipes: 2 },
  { id: 'snack' as const, label: 'Snack', emoji: '🥨', requiredRecipes: 2 },
  { id: 'cena' as const, label: 'Cena', emoji: '🌙', requiredRecipes: 2 }
];

// Helper function to get categories for a meal type
export const getCategories = async (mealType: MealType) => {
  try {
    // Get categories from Supabase
    const { data, error } = await supabase
      .from('recipes')
      .select('category')
      .eq('meal_type', mealType)
      .not('category', 'is', null);

    if (error) throw error;

    // Get unique categories
    const uniqueCategories = [...new Set(data.map(r => r.category))];
    
    // Filter categories based on meal type restrictions
    const allowedCategories = mealTypeCategories[mealType];
    const filteredCategories = uniqueCategories.filter(cat => allowedCategories.includes(cat));
    
    // Map to category objects
    return filteredCategories.map(category => ({
      id: category,
      label: category,
      emoji: getCategoryEmoji(category)
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return static categories filtered by meal type
    return categories.filter(cat => mealTypeCategories[mealType].includes(cat.id));
  }
};

// Helper function to get emoji for category
export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Aves': '🍗',
    'Carnes': '🥩',
    'Ensaladas': '🥗',
    'Fast Food': '🍔',
    'Legumbres': '🫘',
    'Pastas y Arroces': '🍝',
    'Pescados': '🐟',
    'Sopas y Cremas': '🥣',
    'Vegetariano': '🥬',
    'Desayuno': '🍳',
    'Huevos': '🥚',
    'Snack': '🥨',
    'Otros': '🍽️'
  };

  return emojiMap[category] || '🍽️';
}

// Export cuisine types
export const cuisineTypes = [
  { id: 'italiana', label: 'Italiana', emoji: '🇮🇹' },
  { id: 'mexicana', label: 'Mexicana', emoji: '🇲🇽' },
  { id: 'española', label: 'Española', emoji: '🇪🇸' },
  // ... rest of cuisine types
] as const;

// Export function to get cuisine emoji
export function getCuisineEmoji(cuisineType: string): string {
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  return cuisine?.emoji || '🍽️';
}

// Export category order for shopping list
export const categoryOrder = [
  'Carnicería',
  'Pescadería',
  'Charcutería',
  'Vegetales y Legumbres',
  'Frutas',
  'Cereales y Derivados',
  'Lácteos y Derivados',
  'Líquidos y Caldos',
  'Condimentos y Especias',
  'Salsas y Aderezos',
  'Frutos Secos',
  'Otras Categorías'
] as const;