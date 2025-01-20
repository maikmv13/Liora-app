import React from 'react';
import { X, Plus, Flame, Eye, PenSquare } from 'lucide-react';
import { MenuItem, MealType } from '../../types';
import { getMealIcon, getMealLabel } from './utils';
import { useNavigate } from 'react-router-dom';

interface MealCellProps {
  meal: MealType;
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
  const navigate = useNavigate();
  const isMainMeal = meal === 'comida' || meal === 'cena';
  const isCompact = !isMainMeal;

  if (menuItem) {
    return (
      <div className="h-full">
        <div 
          onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
          className={`
            h-full p-3 hover:bg-white/50 transition-all duration-200 relative cursor-pointer
            border-b border-balck-100/100
            ${isCompact ? 'py-2' : ''}
          `}
        >
          <div className="flex items-center justify-between mb-1 pl-1">
            <div className="flex items-center space-x-2 text-gray-600">
              {getMealIcon(meal)}
              <span className={`font-medium ${
                isMainMeal ? 'text-sm text-gray-900' : 'text-xs text-gray-500'
              }`}>
                {getMealLabel(meal)}
              </span>
            </div>
            {menuItem.recipe.calories && (
              <div className="inline-flex items-center space-x-1 bg-white/80 px-1.5 py-0.5 rounded-lg border border-rose-100 mr-5">
                <Flame size={10} className="text-rose-500" />
                <span className="text-[10px] font-medium text-rose-600">{menuItem.recipe.calories}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0 pl-7 pb-2">
            <span className="font-medium text-gray-900 truncate">
              {menuItem.recipe.name}
            </span>
            {menuItem.recipe.side_dish && (
              <span className="text-xs text-gray-500 truncate">
                {menuItem.recipe.side_dish}
              </span>
            )}
          </div>
          
          <div className="absolute bottom-2 right-10 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMealClick();
              }}
              className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200"
              title="Cambiar receta"
            >
              <PenSquare size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
              title="Eliminar"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onMealClick}
      className={`w-full h-full text-left hover:bg-white/50 transition-all duration-200 ${
        isCompact ? 'p-2' : 'p-3'
      }`}
    >
      <div className="flex items-center space-x-2 mb-1 text-gray-400 pl-7">
        {getMealIcon(meal)}
        <span className={`font-medium ${
          isMainMeal ? 'text-sm text-gray-700' : 'text-xs text-gray-500'
        }`}>
          {getMealLabel(meal)}
        </span>
      </div>
      <div className="flex items-center space-x-1 text-rose-500 pl-7">
        <Plus size={isCompact ? 12 : 14} />
        <span className={`font-medium ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
          Añadir {meal.toLowerCase()}
        </span>
      </div>
    </button>
  );
}