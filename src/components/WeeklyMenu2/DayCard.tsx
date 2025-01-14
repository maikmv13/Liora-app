import React from 'react';
import { MenuItem, MealType, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { MealCell } from './MealCell';
import { Calendar, Sparkles } from 'lucide-react';
import { WeekDay } from './constants';

interface DayCardProps {
  day: WeekDay;
  menuItems: MenuItem[];
  onMealClick: (meal: MealType) => void;
  onRemoveMeal: (meal: MealType) => void;
  onViewRecipe: (recipe: MenuItem) => void;
  onAddToMenu?: (recipe: Recipe | null, day: WeekDay, meal: MealType) => void;
  activeMenu?: ExtendedWeeklyMenuDB | null;
  expanded?: boolean;
}

export function DayCard({ 
  day, 
  menuItems, 
  onMealClick, 
  onRemoveMeal,
  onViewRecipe,
  onAddToMenu,
  activeMenu,
  expanded = false
}: DayCardProps) {
  const [hoveredMeal, setHoveredMeal] = React.useState<MealType | null>(null);

  // Check if it's today
  const today = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
  const isToday = today.toLowerCase() === day.toLowerCase();

  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];

  return (
    <div className={`
      bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden h-full
      transition-all duration-300 transform hover:translate-y-[-2px]
      ${isToday 
        ? 'ring-2 ring-rose-200 shadow-lg shadow-rose-100/50 border-2 border-rose-200' 
        : 'border border-gray-200/50 shadow-md hover:shadow-lg'
      }
    `}>
      {/* Header */}
      <div className={`
        px-4 py-3 border-b
        ${isToday 
          ? 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100' 
          : 'bg-gradient-to-r from-gray-50 to-rose-50/30 border-gray-100/50'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              p-2 rounded-xl transition-all duration-300
              ${isToday ? 'bg-rose-100' : 'bg-white/80'}
            `}>
              <Calendar size={18} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{day}</h3>
              {isToday && (
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                  <Sparkles size={12} className="text-amber-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meals Grid - Fixed height rows */}
      <div className="grid grid-rows-4 h-[calc(100%-4rem)]">
        {mealTypes.map((meal) => {
          const menuItem = menuItems.find(item => item.meal === meal);
          const isMainMeal = meal === 'comida' || meal === 'cena';
          
          return (
            <div 
              key={meal}
              className={`relative transition-colors duration-200
                ${meal === 'desayuno' ? 'bg-amber-50/20' : ''}
                ${meal === 'comida' ? 'bg-orange-50/20' : ''}
                ${meal === 'snack' ? 'bg-emerald-50/20' : ''}
                ${meal === 'cena' ? 'bg-indigo-50/20' : ''}
              `}
              onMouseEnter={() => setHoveredMeal(meal)}
              onMouseLeave={() => setHoveredMeal(null)}
            >
              <MealCell
                meal={meal}
                menuItem={menuItem}
                isHovered={hoveredMeal === meal}
                onMealClick={() => onMealClick(meal)}
                onRemove={() => onRemoveMeal(meal)}
                onViewRecipe={() => menuItem && onViewRecipe(menuItem)}
                variant={isMainMeal ? 'prominent' : 'compact'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}