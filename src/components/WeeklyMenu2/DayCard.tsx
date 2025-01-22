import React from 'react';
import { MenuItem, MealType, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { MealCell } from './MealCell';
import { Calendar, Sparkles } from 'lucide-react';
import { WeekDay } from './constants';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { supabase } from "../../lib/supabase";

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
  const navigate = useNavigate();
  const { id, isHousehold } = useActiveProfile();

  // Obtener el día actual y el siguiente
  const today = new Date();
  const currentDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(today).toLowerCase();
  const isToday = currentDay === day.toLowerCase();
  
  // Modificar la lógica para el "mañana"
  const isTomorrow = React.useMemo(() => {
    // Si es domingo después de las 21:00, el lunes es "mañana"
    if (today.getDay() === 0 && today.getHours() >= 21 && day.toLowerCase() === 'lunes') {
      return true;
    }
    
    // Lógica original para otros días
    if (today.getDay() === 0 || day.toLowerCase() === 'lunes') return false;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(tomorrow).toLowerCase();
    
    return nextDay === day.toLowerCase();
  }, [day]);

  // Scroll lateral solo en móvil
  React.useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) return;

      try {
        if (isToday) {
          // Solo hacer scroll lateral al día actual
          const dayCard = document.getElementById(`day-card-${day}`);
          if (dayCard) {
            dayCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      } catch (error) {
        console.error('Error en scroll automático:', error);
      }
    };

    // Pequeño delay para asegurar que los elementos están renderizados
    const timeoutId = setTimeout(handleScroll, 500);
    return () => clearTimeout(timeoutId);
  }, [day, isToday]);

  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];

  const handleRecipeSelect = async (recipe: Recipe | null) => {
    try {
      const { error } = await supabase
        .from('weekly_menus')
        .update({
          [`${day}_${meal}_id`]: recipe?.id || null
        })
        .eq(isHousehold ? 'household_id' : 'user_id', id);

      if (error) throw error;
      
      // ... resto del código
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };

  return (
    <div 
      id={`day-card-${day}`}
      className={`
        bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden h-full
        transition-all duration-300 transform hover:translate-y-[-2px]
        my-2 md:my-0
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

      {/* Meals Grid - Fixed height rows - Actualizado con padding */}
      <div className="grid grid-rows-4 h-[calc(100%-4rem)] py-1 md:py-0">
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
                onViewRecipe={() => menuItem && navigate(`/recipe/${menuItem.recipe.id}`)}
                variant={isMainMeal ? 'prominent' : 'compact'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}