import React from 'react';
import { MenuItem } from '../../types';
import { DayCard } from './DayCard';
import { weekDays } from './utils';

interface DesktopViewProps {
  weekDays: string[];
  weeklyMenu: MenuItem[];
  onMealClick: (day: string, meal: 'comida' | 'cena') => void;
  onRemoveMeal: (day: string, meal: 'comida' | 'cena') => void;
  onViewRecipe: (recipe: MenuItem) => void;
}

export function DesktopView({ 
  weeklyMenu, 
  onMealClick, 
  onRemoveMeal,
  onViewRecipe 
}: DesktopViewProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map(day => (
        <DayCard
          key={day}
          day={day}
          menuItems={weeklyMenu.filter(item => item.day === day)}
          onMealClick={(meal) => onMealClick(day, meal)}
          onRemoveMeal={(meal) => onRemoveMeal(day, meal)}
          onViewRecipe={onViewRecipe}
        />
      ))}
    </div>
  );
}