import React from 'react';
import { MenuItem, MealType, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { DayCard } from './DayCard';
import { DAYS, WeekDay } from './constants';

interface DesktopViewProps {
  weekDays: readonly WeekDay[];
  weeklyMenu: MenuItem[];
  onMealClick: (day: WeekDay, meal: MealType) => void;
  onRemoveMeal: (day: WeekDay, meal: MealType) => void;
  onViewRecipe: (menuItem: MenuItem) => void;
  onAddToMenu: (recipe: Recipe | null, day: WeekDay, meal: MealType) => void;
  activeMenu: ExtendedWeeklyMenuDB | null;
}

export function DesktopView({ 
  weekDays, 
  weeklyMenu, 
  onMealClick, 
  onRemoveMeal,
  onViewRecipe,
  onAddToMenu,
  activeMenu
}: DesktopViewProps) {
  return (
    <div className="grid grid-cols-7 gap-4 p-4 bg-gradient-to-br from-gray-100/50 to-rose-100/30 rounded-3xl border border-white/50 shadow-lg backdrop-blur-sm">
      {weekDays.map(day => (
        <DayCard
          key={day}
          day={day}
          menuItems={weeklyMenu.filter(item => item.day === day)}
          onMealClick={(meal) => onMealClick(day, meal)}
          onRemoveMeal={(meal) => onRemoveMeal(day, meal)}
          onViewRecipe={onViewRecipe}
          onAddToMenu={onAddToMenu}
          activeMenu={activeMenu}
          expanded={true}
        />
      ))}
    </div>
  );
}