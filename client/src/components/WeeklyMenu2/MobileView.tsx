import React from 'react';
import { ChevronLeft, ChevronRight, X, Plus, Flame, Eye, PenSquare } from 'lucide-react';
import { MenuItem } from '../../types';
import { getMealIcon } from './utils';
import { DAYS, type WeekDay } from './constants';

interface MobileViewProps {
  selectedDay: WeekDay;
  weekDays: typeof DAYS;
  weeklyMenu: MenuItem[];
  onDayChange: (day: WeekDay) => void;
  onMealClick: (day: string, meal: 'comida' | 'cena') => void;
  onRemoveMeal: (day: string, meal: 'comida' | 'cena') => void;
  onViewRecipe: (menuItem: MenuItem) => void;
}

export function MobileView({ 
  selectedDay, 
  weekDays, 
  weeklyMenu,
  onDayChange,
  onMealClick,
  onRemoveMeal,
  onViewRecipe
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

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`flex-none px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-rose-50 text-rose-600 font-medium border-2 border-rose-200'
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-rose-50/50 border border-rose-100'
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
          <div key={meal} className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-rose-100/20 overflow-hidden hover:border-rose-200 transition-colors">
            <div className="flex items-center justify-between p-3 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
              <div className="flex items-center space-x-2 text-gray-600">
                {getMealIcon(meal)}
                <span className="font-medium text-sm">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
              </div>
            </div>
            {menuItem ? (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{menuItem.recipe.Plato}</p>
                  <div className="flex items-center space-x-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    <Flame size={12} className="text-rose-500" />
                    <span className="text-xs font-medium text-rose-600">{menuItem.recipe.Calorias}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{menuItem.recipe.Acompañamiento}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewRecipe(menuItem)}
                    className="flex-1 flex items-center justify-center space-x-2 p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    <Eye size={18} />
                    <span className="text-sm font-medium">Ver receta</span>
                  </button>
                  <button
                    onClick={() => onMealClick(selectedDay, meal)}
                    className="flex-1 flex items-center justify-center space-x-2 p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    <PenSquare size={18} />
                    <span className="text-sm font-medium">Cambiar</span>
                  </button>
                  <button
                    onClick={() => onRemoveMeal(selectedDay, meal)}
                    className="flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <X size={18} />
                  </button>
                </div>
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