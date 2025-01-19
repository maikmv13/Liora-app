import React, { useState } from 'react';
import { Soup, Check } from 'lucide-react';
import type { Recipe, RecipeIngredient } from '../../../types';
import { getUnitPlural } from '../../../utils/getUnitPlural';
import { useAI } from '../../../hooks/useAI';

type IngredientsProps = Readonly<{
  recipe: Recipe;
}>;

export function Ingredients({ recipe }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const { askAboutStep } = useAI(recipe);

  console.log('=== Debug Ingredients ===');
  console.log('Recipe:', recipe);
  console.log('Recipe ingredients:', recipe.recipe_ingredients);

  // Validación temprana
  if (!recipe.recipe_ingredients || recipe.recipe_ingredients.length === 0) {
    console.log('No recipe ingredients found');
    return null;
  }

  // Agrupamos los ingredientes por categoría
  const groupedIngredients = recipe.recipe_ingredients.reduce((acc, ri) => {
    if (!ri.ingredients) {
      console.log('Missing ingredients for:', ri);
      return acc;
    }
    
    const category = ri.ingredients.category || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ri);
    return acc;
  }, {} as Record<string, RecipeIngredient[]>);

  console.log('Grouped ingredients:', groupedIngredients);

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
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-rose-50 p-2 rounded-lg">
            <Soup size={20} className="text-rose-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Ingredientes</h2>
              <span className="text-sm text-gray-500">
                {checkedIngredients.size} de {recipe.recipe_ingredients.length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {recipe.recipe_ingredients.map((ri) => {
            // Validación de seguridad
            if (!ri.ingredients || !ri.ingredients.name) {
              console.log('Invalid ingredient:', ri);
              return null;
            }

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
      </div>
    </div>
  );
}