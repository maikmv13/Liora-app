import React from 'react';
import { X, Plus, Flame, Eye, PenSquare } from 'lucide-react';
import { MenuItem } from '../../types';
import { getMealIcon } from './utils';

interface MealCellProps {
  meal: 'comida' | 'cena';
  menuItem?: MenuItem;
  isHovered: boolean;
  onMealClick: () => void;
  onRemove: () => void;
  onViewRecipe: () => void;
}

export function MealCell({ 
  meal, 
  menuItem, 
  isHovered, 
  onMealClick, 
  onRemove,
  onViewRecipe 
}: MealCellProps) {
  if (menuItem) {
    return (
      <div className="p-3 hover:bg-rose-50/50 transition-all duration-200 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-gray-600">
            {getMealIcon(meal)}
            <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
          </div>
          <div className="inline-flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200 whitespace-nowrap">
            <Flame size={10} className="text-rose-500 flex-shrink-0" />
            <span className="text-[10px] font-medium text-rose-600">{menuItem.recipe.Calorias}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
          {menuItem.recipe.Plato}
        </p>
        
        {isHovered && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2">
            <button
              onClick={onViewRecipe}
              className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
              title="Ver receta"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={onMealClick}
              className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
              title="Cambiar receta"
            >
              <PenSquare size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
              title="Eliminar"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onMealClick}
      className="w-full p-3 text-left hover:bg-rose-50/50 transition-all duration-200"
    >
      <div className="flex items-center space-x-2 mb-1 text-gray-400">
        {getMealIcon(meal)}
        <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
      </div>
      <div className="flex items-center space-x-1 text-rose-500">
        <Plus size={14} />
        <span className="text-xs font-medium">Añadir plato</span>
      </div>
    </button>
  );
}