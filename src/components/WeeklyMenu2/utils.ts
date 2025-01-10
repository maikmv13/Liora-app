import { Utensils, Moon } from 'lucide-react';
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
    case 'comida':
      return React.createElement(Utensils, iconProps);
    case 'cena':
      return React.createElement(Moon, iconProps);
    default:
      return null;
  }
}