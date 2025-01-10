import React from 'react';
import { X, Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { getMealIcon } from './utils';

interface MealCellProps {
  meal: 'comida' | 'cena';
  menuItem?: MenuItem;
  isHovered: boolean;
  onMealClick: () => void;
  onRemove: () => void;
}

export function MealCell({ meal, menuItem, isHovered, onMealClick, onRemove }: MealCellProps) {
  if (menuItem) {
    return (
      <div 
        className="p-3 cursor-pointer group"
        onClick={onMealClick}
      >
        <div className="flex items-center space-x-2 mb-1 text-gray-600">
          {getMealIcon(meal)}
          <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
        </div>
        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {menuItem.recipe.Plato}
        </p>
        <p className="text-xs text-gray-500 mt-1">{menuItem.recipe.Calorias}</p>
        
        {isHovered && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
          >
            <X size={14} className="text-red-500" />
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onMealClick}
      className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-2 mb-1 text-gray-400">
        {getMealIcon(meal)}
        <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
      </div>
      <div className="flex items-center space-x-1 text-emerald-600">
        <Plus size={14} />
        <span className="text-xs font-medium">Añadir plato</span>
      </div>
    </button>
  );
}