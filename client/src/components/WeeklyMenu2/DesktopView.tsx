import React from 'react';
import { MenuItem, MealType } from '../../types';
import { DayCard } from './DayCard';
import { weekDays } from './utils';
import { DAYS, type WeekDay } from './constants';

interface DesktopViewProps {
  weekDays: typeof DAYS;
  weeklyMenu: MenuItem[];
  onMealClick: (day: string, meal: 'comida' | 'cena') => void;
  onRemoveMeal: (day: string, meal: 'comida' | 'cena') => void;
  onViewRecipe: (menuItem: MenuItem) => void;
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