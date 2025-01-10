import React from 'react';
import { MenuItem } from '../../types';
import { DayCard } from './DayCard';

interface DesktopViewProps {
  weekDays: string[];
  weeklyMenu: MenuItem[];
  onMealClick: (day: string, meal: 'comida' | 'cena') => void;
  onRemoveMeal: (day: string, meal: 'comida' | 'cena') => void;
}

export function DesktopView({ weekDays, weeklyMenu, onMealClick, onRemoveMeal }: DesktopViewProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map(day => (
        <DayCard
          key={day}
          day={day}
          menuItems={weeklyMenu.filter(item => item.day === day)}
          onMealClick={(meal) => onMealClick(day, meal)}
          onRemoveMeal={(meal) => onRemoveMeal(day, meal)}
        />
      ))}
    </div>
  );
}