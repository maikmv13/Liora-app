import React, { useState } from 'react';
import { MenuItem, MealType } from '../../types';
import { MealCell } from './MealCell';
import { ChefHat, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DayCardProps {
  day: string;
  menuItems: MenuItem[];
  onMealClick: (meal: MealType) => void;
  onRemoveMeal: (meal: MealType) => void;
  onViewRecipe: (recipe: MenuItem) => void;
}

// Agregar los mapeos necesarios
const dayMapping: Record<string, string> = {
  'Lunes': 'monday',
  'Martes': 'tuesday',
  'Miércoles': 'wednesday',
  'Jueves': 'thursday',
  'Viernes': 'friday',
  'Sábado': 'saturday',
  'Domingo': 'sunday'
};

const mealMapping: Record<string, string> = {
  'desayuno': 'breakfast',
  'comida': 'lunch',
  'snack': 'snack',
  'cena': 'dinner'
};

export function DayCard({ 
  day, 
  menuItems, 
  onMealClick, 
  onRemoveMeal: onRemove,
  onViewRecipe 
}: DayCardProps) {
  const [hoveredMeal, setHoveredMeal] = useState<MealType | null>(null);

  const handleRemove = async (meal: MealType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data: activeMenu } = await supabase
        .from('weekly_menus')
        .select('id')
        .eq('status', 'active')
        .eq('user_id', user.id)
        .single();

      if (activeMenu) {
        const fieldName = `${dayMapping[day]}_${mealMapping[meal]}`;
        await supabase
          .from('weekly_menus')
          .update({ [fieldName]: null })
          .eq('id', activeMenu.id);
      }

      onRemove(meal);
    } catch (error) {
      console.error('Error al eliminar la comida:', error);
    }
  };

  // Calcular calorías totales del día
  const totalCalorias = menuItems.reduce((total, item) => {
    return total + parseInt(item.recipe.calories?.replace(/\D/g, '') || '0');
  }, 0);

  // Obtener el día actual
  const today = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
  const isToday = today.toLowerCase() === day.toLowerCase();

  const mealTypes: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border-2 transition-all duration-300 ${
      isToday 
        ? 'border-rose-200 ring-2 ring-rose-100/50' 
        : 'border-rose-100/20 hover:border-rose-200'
    }`}>
      {/* Cabecera del día */}
      <div className="p-3 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-rose-500" />
            <h3 className="text-sm font-medium text-gray-900">{day}</h3>
          </div>
          {isToday && (
            <span className="text-[10px] font-medium text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">
              Hoy
            </span>
          )}
        </div>
      </div>

      {/* Contenido de las comidas */}
      <div className="divide-y divide-rose-100/10">
        {mealTypes.map((meal) => {
          const menuItem = menuItems.find(item => item.meal === meal);
          const isMainMeal = meal === 'comida' || meal === 'cena';
          const bgClass = {
            desayuno: 'bg-amber-50/20 border-b border-amber-100/20',
            comida: 'bg-white',
            snack: 'bg-emerald-50/20 border-t border-b border-emerald-100/20',
            cena: 'bg-white'
          }[meal];

          return (
            <div 
              key={meal}
              className={`relative ${bgClass}`}
              onMouseEnter={() => setHoveredMeal(meal)}
              onMouseLeave={() => setHoveredMeal(null)}
            >
              <MealCell
                meal={meal}
                menuItem={menuItem}
                isHovered={hoveredMeal === meal}
                onMealClick={() => onMealClick(meal)}
                onRemove={() => onRemove(meal)}
                onViewRecipe={() => menuItem && onViewRecipe(menuItem)}
                variant={isMainMeal ? 'prominent' : 'compact'}
              />
            </div>
          );
        })}
      </div>

      {/* Footer con resumen del día */}
      {menuItems.length > 0 && (
        <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-rose-50/30 border-t border-rose-100/20">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1 text-gray-600">
              <ChefHat size={12} className="text-rose-400" />
              <span>{menuItems.length} platos</span>
            </div>
            {totalCalorias > 0 && (
              <span className="font-medium text-rose-600">
                {totalCalorias} kcal
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}