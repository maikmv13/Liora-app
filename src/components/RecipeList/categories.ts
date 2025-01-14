import { MealType } from '../../types';

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
  { id: 'Vegetariano', label: 'Vegetariano', emoji: '🥬' }
] as const;

export const mealTypes: { id: MealType; label: string; emoji: string }[] = [
  { id: 'desayuno', label: 'Desayuno', emoji: '🍳' },
  { id: 'comida', label: 'Comida', emoji: '🍽️' },
  { id: 'snack', label: 'Snack', emoji: '🥨' },
  { id: 'cena', label: 'Cena', emoji: '🌙' }
];