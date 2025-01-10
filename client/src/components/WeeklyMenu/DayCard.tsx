import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { MealCell } from './MealCell';

interface DayCardProps {
  day: string;
  menuItems: MenuItem[];
  onMealClick: (meal: 'comida' | 'cena') => void;
  onRemoveMeal: (meal: 'comida' | 'cena') => void;
}

export function DayCard({ day, menuItems, onMealClick, onRemoveMeal }: DayCardProps) {
  const [hoveredMeal, setHoveredMeal] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">{day}</h3>
      </div>
      <div className="space-y-1">
        {(['comida', 'cena'] as const).map((meal) => {
          const menuItem = menuItems.find(item => item.meal === meal);
          
          return (
            <div 
              key={meal}
              className="relative"
              onMouseEnter={() => setHoveredMeal(meal)}
              onMouseLeave={() => setHoveredMeal(null)}
            >
              <MealCell
                meal={meal}
                menuItem={menuItem}
                isHovered={hoveredMeal === meal}
                onMealClick={() => onMealClick(meal)}
                onRemove={() => onRemoveMeal(meal)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}