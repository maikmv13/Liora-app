import React from 'react';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { getMealIcon } from './utils';

interface MobileViewProps {
  selectedDay: string;
  weekDays: string[];
  weeklyMenu: MenuItem[];
  onDayChange: (day: string) => void;
  onMealClick: (day: string, meal: 'comida' | 'cena') => void;
  onRemoveMeal: (day: string, meal: 'comida' | 'cena') => void;
}

export function MobileView({ 
  selectedDay, 
  weekDays, 
  weeklyMenu,
  onDayChange,
  onMealClick,
  onRemoveMeal
}: MobileViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const prevIndex = (currentIndex - 1 + weekDays.length) % weekDays.length;
              onDayChange(weekDays[prevIndex]);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{selectedDay}</h3>
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const nextIndex = (currentIndex + 1) % weekDays.length;
              onDayChange(weekDays[nextIndex]);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {(['comida', 'cena'] as const).map((meal) => {
        const menuItem = weeklyMenu.find(
          item => item.day === selectedDay && item.meal === meal
        );

        return (
          <div key={meal} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-gray-600">
                {getMealIcon(meal)}
                <span className="font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
              </div>
              {menuItem && (
                <button
                  onClick={() => onRemoveMeal(selectedDay, meal)}
                  className="p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={16} className="text-red-500" />
                </button>
              )}
            </div>
            {menuItem ? (
              <div
                onClick={() => onMealClick(selectedDay, meal)}
                className="cursor-pointer"
              >
                <p className="font-medium text-gray-900">{menuItem.recipe.Plato}</p>
                <p className="text-sm text-gray-500 mt-1">{menuItem.recipe.Calorias}</p>
              </div>
            ) : (
              <button
                onClick={() => onMealClick(selectedDay, meal)}
                className="w-full py-2 text-emerald-600 text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Plus size={16} />
                <span>Añadir plato</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}