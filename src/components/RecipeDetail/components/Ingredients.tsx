import React, { useState } from 'react';
import { Soup, Check } from 'lucide-react';
import type { Recipe, RecipeIngredient, Ingredient } from '../../../types';
import { getUnitPlural } from '../../../utils/getUnitPlural';
import { useAI } from '../../../hooks/useAI';

interface IngredientsProps {
  recipe: Recipe;
}

interface GroupedIngredients {
  [category: string]: RecipeIngredient[];
}

export function Ingredients({ recipe }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const { askAboutStep } = useAI(recipe);

  // Validación temprana
  if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
    console.log('No recipe ingredients found');
    return null;
  }

  // Agrupar ingredientes por categoría
  const groupedIngredients = recipe.recipe_ingredients.reduce<GroupedIngredients>((acc, ri) => {
    if (!ri.ingredient) {
      console.log('Missing ingredient for:', ri);
      return acc;
    }
    
    const category = ri.ingredient.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ri);
    return acc;
  }, {});

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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/20">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-3 rounded-xl shadow-sm border border-rose-100/50">
            <Soup size={24} className="text-rose-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-lg">Ingredientes</h2>
              <span className="text-sm text-gray-500">
                {checkedIngredients.size} de {recipe.recipe_ingredients.length}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 to-orange-500 transition-all duration-300"
                style={{ width: `${(checkedIngredients.size / recipe.recipe_ingredients.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedIngredients).map(([category, ingredients]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {ingredients.map((ri) => {
                  const unit = getUnitPlural(ri.unit, ri.quantity);
                  const isChecked = checkedIngredients.has(ri.id);

                  return (
                    <button
                      key={ri.id}
                      onClick={() => handleToggleIngredient(ri.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                        isChecked 
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors
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
                          {ri.ingredient.name}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}