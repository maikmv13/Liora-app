import React from 'react';
import { MenuItem, MealType, Recipe, } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { DayCard } from './DayCard';
import { DAYS, WeekDay } from './constants';

interface MobileViewProps {
  selectedDay: WeekDay;
  weekDays: readonly WeekDay[];
  weeklyMenu: MenuItem[];
  onDayChange: (day: WeekDay) => void;
  onMealClick: (day: WeekDay, meal: MealType) => void;
  onRemoveMeal: (day: WeekDay, meal: MealType) => void;
  onViewRecipe: (menuItem: MenuItem) => void;
  onAddToMenu: (recipe: Recipe | null, day: WeekDay, meal: MealType) => void;
  activeMenu: ExtendedWeeklyMenuDB | null;
}

export function MobileView({ 
  selectedDay, 
  weekDays, 
  weeklyMenu,
  onDayChange,
  onMealClick,
  onRemoveMeal,
  onViewRecipe,
  onAddToMenu,
  activeMenu
}: MobileViewProps) {
  return (
    <div className="space-y-4">
      <DayCard
        day={selectedDay}
        menuItems={weeklyMenu.filter(item => item.day === selectedDay)}
        onMealClick={(meal) => onMealClick(selectedDay, meal)}
        onRemoveMeal={(meal) => onRemoveMeal(selectedDay, meal)}
        onViewRecipe={onViewRecipe}
        onAddToMenu={onAddToMenu}
        activeMenu={activeMenu}
      />
    </div>
  );
}