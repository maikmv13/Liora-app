import { MealType } from '../types';

export type MenuRules = {
  allowedCategories: string[];
  restrictedCategories?: Record<string, { startDay: number }>;
  weeklyLimits?: Record<string, number>;
};

export const menuRules: Record<MealType, MenuRules> = {
  desayuno: {
    allowedCategories: ['Desayunos']
  },
  comida: {
    allowedCategories: ['Aves', 'Carnes', 'Pastas y Arroces', 'Pescados', 'Legumbres'],
    restrictedCategories: {
      'Fast Food': { startDay: 4 }
    },
    weeklyLimits: {
      'Carnes': 2,
      'Pescados': 2
    }
  },
  cena: {
    allowedCategories: ['Sopas', 'Ensaladas', 'Vegetariano'],
    weeklyLimits: {
      'Sopas': 2
    }
  }
}; 