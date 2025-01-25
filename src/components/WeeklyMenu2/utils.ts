import { Utensils, Moon, Sun, Coffee, Cookie } from 'lucide-react';
import React from 'react';

export const weekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
] as const;

export function getMealIcon(meal: string): React.ReactNode {
  const iconProps = {
    size: 16,
    className: "text-rose-500"
  };

  switch (meal) {
    case 'desayuno':
      return React.createElement(Coffee, iconProps);
    case 'comida':
      return React.createElement(Utensils, iconProps);
    case 'cena':
      return React.createElement(Moon, iconProps);
    case 'snack':
      return React.createElement(Cookie, iconProps);
    default:
      return null;
  }
}

export function getMealLabel(meal: string): string {
  switch (meal) {
    case 'desayuno':
      return 'Desayuno';
    case 'comida':
      return 'Comida';
    case 'cena':
      return 'Cena';
    case 'snack':
      return 'Snack';
    default:
      return meal;
  }
}

export function getMealBackground(meal: string): string {
  switch (meal) {
    case 'desayuno':
      return 'bg-amber-50/30';
    case 'comida':
      return 'bg-rose-50/30';
    case 'cena':
      return 'bg-indigo-50/30';
    case 'snack':
      return 'bg-emerald-50/30';
    default:
      return '';
  }
}

export const getFavoriteStatus = (
  recipe: Recipe, 
  favorites: FavoriteRecipe[], 
  userId: string,
  isHousehold: boolean
) => {
  return favorites.some(fav => 
    fav.recipe_id === recipe.id && 
    (fav.user_id === userId || isHousehold)
  );
};