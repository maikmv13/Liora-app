import React from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Flame } from 'lucide-react';
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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const prevIndex = (currentIndex - 1 + weekDays.length) % weekDays.length;
              onDayChange(weekDays[prevIndex]);
            }}
            className="p-2 hover:bg-rose-50/50 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} className="text-rose-500" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{selectedDay}</h3>
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const nextIndex = (currentIndex + 1) % weekDays.length;
              onDayChange(weekDays[nextIndex]);
            }}
            className="p-2 hover:bg-rose-50/50 rounded-xl transition-colors"
          >
            <ChevronRight size={20} className="text-rose-500" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`flex-none px-4 py-2 rounded-xl transition-colors ${
                selectedDay === day
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-rose-50/50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {(['comida', 'cena'] as const).map((meal) => {
        const menuItem = weeklyMenu.find(
          item => item.day === selectedDay && item.meal === meal
        );

        return (
          <div key={meal} className="bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100/20 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-rose-100/20">
              <div className="flex items-center space-x-2 text-gray-600">
                {getMealIcon(meal)}
                <span className="font-medium text-sm">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
              </div>
              {menuItem && (
                <button
                  onClick={() => onRemoveMeal(selectedDay, meal)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} className="text-red-500" />
                </button>
              )}
            </div>
            {menuItem ? (
              <div
                onClick={() => onMealClick(selectedDay, meal)}
                className="p-3 cursor-pointer hover:bg-rose-50/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{menuItem.recipe.Plato}</p>
                  <div className="flex items-center space-x-1 bg-rose-50 px-2 py-0.5 rounded-lg">
                    <Flame size={12} className="text-rose-500" />
                    <span className="text-xs font-medium text-rose-600">{menuItem.recipe.Calorias}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{menuItem.recipe.Acompañamiento}</p>
              </div>
            ) : (
              <button
                onClick={() => onMealClick(selectedDay, meal)}
                className="w-full p-3 text-rose-500 text-sm font-medium flex items-center justify-center space-x-1 hover:bg-rose-50/50 transition-colors"
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