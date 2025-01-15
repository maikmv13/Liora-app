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

  // Obtener el día actual y el siguiente
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const currentDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(today);
  const nextDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(tomorrow);
  
  const isToday = currentDay.toLowerCase() === day.toLowerCase();
  const isTomorrow = nextDay.toLowerCase() === day.toLowerCase();

  // Scroll automático al día siguiente al cargar la página en móvil
  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const shouldScroll = isTomorrow && isMobile;

    if (shouldScroll) {
      // Pequeño timeout para asegurar que los elementos están renderizados
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(`day-card-${day}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []); // Solo se ejecuta al montar el componente

  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];

  return (
    <div 
      id={`day-card-${day}`}
      className={`
        bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden h-full
        transition-all duration-300 transform hover:translate-y-[-2px]
        ${isToday 
          ? 'ring-2 ring-rose-200 shadow-lg shadow-rose-100/50 border-2 border-rose-200' 
          : isTomorrow
            ? 'ring-1 ring-orange-200 shadow-lg shadow-orange-100/50 border border-orange-200'
            : 'border border-gray-200/50 shadow-md hover:shadow-lg'
        }
      `}
    >
      {/* Header */}
      <div className={`
        px-4 py-3 border-b
        ${isToday 
          ? 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100'
          : isTomorrow
            ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'
            : 'bg-gradient-to-r from-gray-50 to-rose-50/30 border-gray-100/50'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              p-2 rounded-xl transition-all duration-300
              ${isToday ? 'bg-rose-100' : isTomorrow ? 'bg-orange-100' : 'bg-white/80'}
            `}>
              <Calendar size={18} className={`
                ${isToday ? 'text-rose-500' : isTomorrow ? 'text-orange-500' : 'text-gray-500'}
              `} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{day}</h3>
              {(isToday || isTomorrow) && (
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className={`
                    text-[10px] font-semibold px-2 py-0.5 rounded-full
                    ${isToday 
                      ? 'text-rose-600 bg-rose-100' 
                      : 'text-orange-600 bg-orange-100'
                    }
                  `}>
                    {isToday ? 'Hoy' : 'Mañana'}
                  </span>
                  <Sparkles size={12} className={`
                    ${isToday ? 'text-amber-400' : 'text-orange-400'} 
                    animate-pulse
                  `} />
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