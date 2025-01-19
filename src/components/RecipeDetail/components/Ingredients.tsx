import React, { useState } from 'react';
import { Soup, Check } from 'lucide-react';
import type { Recipe } from '../../../types';
import { getUnitPlural } from '../../../utils/getUnitPlural';

interface IngredientsProps {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export function Ingredients({ recipe, isExpanded, onToggle }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const handleToggleIngredient = (ingredientId: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 border-t border-gray-100"
      >
        <div className="flex items-center space-x-2">
          <Soup size={20} className="text-rose-500" />
          <div>
            <h2 className="font-medium text-gray-900">Ingredientes</h2>
            <p className="text-sm text-gray-500">
              {recipe.recipe_ingredients.length} ingredientes
            </p>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-2">
          {recipe.recipe_ingredients.map((ri) => {
            if (!ri?.ingredients?.name) return null;
            
            const unit = getUnitPlural(ri.unit, ri.quantity);
            const isChecked = checkedIngredients.has(ri.id);
            
            return (
              <button
                key={ri.id}
                onClick={() => handleToggleIngredient(ri.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isChecked 
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-5 h-5 rounded-lg border flex items-center justify-center transition-colors
                    ${isChecked
                      ? 'bg-emerald-500 border-transparent'
                      : 'border-gray-300'
                    }
                  `}>
                    {isChecked && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`font-medium ${
                    isChecked ? 'line-through text-emerald-700' : 'text-gray-700'
                  }`}>
                    {ri.ingredients.name}
                  </span>
                </div>
                <span className={`text-sm ${
                  isChecked ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {ri.quantity} {unit}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}