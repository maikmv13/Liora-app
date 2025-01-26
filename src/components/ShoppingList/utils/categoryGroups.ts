export const CATEGORY_GROUPS = {
  FRESCOS: [
    'Frutas',
    'Verduras',
    'Carnes',
    'Pescados',
    'Lácteos',
    'Huevos',
    'Panadería'
  ],
  DESPENSA: [
    'Cereales',
    'Legumbres',
    'Pasta',
    'Arroz',
    'Conservas',
    'Salsas',
    'Aceites',
    'Especias'
  ],
  OTROS: [
    'Snacks',
    'Bebidas',
    'Congelados',
    'Dulces',
    'Otros'
  ]
} as const;

export type CategoryGroup = keyof typeof CATEGORY_GROUPS;

export function getCategoryGroup(category: string): CategoryGroup {
  const normalizedCategory = category.toLowerCase();
  
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.some(c => c.toLowerCase() === normalizedCategory)) {
      return group as CategoryGroup;
    }
  }
  
  return 'OTROS';
} 