import { Utensils, Moon } from 'lucide-react';

export const weekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export const getMealIcon = (meal: string) => {
  switch (meal) {
    case 'comida':
      return <Utensils size={16} className="text-emerald-500" />;
    case 'cena':
      return <Moon size={16} className="text-emerald-500" />;
    default:
      return null;
  }
};