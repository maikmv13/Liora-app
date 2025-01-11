import React from 'react';
import { X, Plus, Flame, Eye, PenSquare } from 'lucide-react';
import { MenuItem } from '../../types';
import { getMealIcon, getMealLabel } from './utils';

interface MealCellProps {
  meal: 'desayuno' | 'comida' | 'cena' | 'snack';
  menuItem?: MenuItem;
  isHovered: boolean;
  onMealClick: () => void;
  onRemove: () => void;
  onViewRecipe: () => void;
  variant?: 'compact' | 'prominent';
}

export function MealCell({ 
  meal, 
  menuItem, 
  isHovered, 
  onMealClick, 
  onRemove,
  onViewRecipe,
  variant = 'prominent'
}: MealCellProps) {
  const isCompact = variant === 'compact';

  if (menuItem) {
    return (
      <div className={`p-3 hover:bg-rose-50/50 transition-all duration-200 relative ${
        isCompact ? 'py-2' : ''
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-gray-600">
            {getMealIcon(meal)}
            <span className={`font-medium ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
              {getMealLabel(meal)}
            </span>
          </div>
          <div className="inline-flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200 whitespace-nowrap">
            <Flame size={10} className="text-rose-500 flex-shrink-0" />
            <span className="text-[10px] font-medium text-rose-600">{menuItem.recipe.Calorias}</span>
          </div>
        </div>
        <p className={`font-medium text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors ${
          isCompact ? 'text-xs' : 'text-sm'
        }`}>
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
      className={`w-full text-left hover:bg-rose-50/50 transition-all duration-200 ${
        isCompact ? 'p-2' : 'p-3'
      }`}
    >
      <div className="flex items-center space-x-2 mb-1 text-gray-400">
        {getMealIcon(meal)}
        <span className={`font-medium ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
          {getMealLabel(meal)}
        </span>
      </div>
      <div className="flex items-center space-x-1 text-rose-500">
        <Plus size={isCompact ? 12 : 14} />
        <span className={`font-medium ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
          Añadir {meal.toLowerCase()}
        </span>
      </div>
    </button>
  );
}