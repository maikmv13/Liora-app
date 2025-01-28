import React, { useState } from 'react';
import { Soup, Check, Users } from 'lucide-react';
import type { Recipe, RecipeIngredient } from '../../../types';
import { getUnitPlural } from '../../../utils/getUnitPlural';
import { useAI } from '../../../hooks/useAI';

interface IngredientsProps {
  recipe: Recipe;
}

interface GroupedIngredients {
  [category: string]: RecipeIngredient[];
}

// Función para formatear la cantidad y unidad
function formatQuantityAndUnit(quantity: number, unit: string): string {
  const formattedQuantity = Number(quantity.toFixed(1));
  // Usar plural también para cantidades decimales excepto 1.0
  const shouldBePlural = formattedQuantity !== 1;
  const unitText = getUnitPlural(unit, shouldBePlural ? 2 : 1);
  return `${formattedQuantity} ${unitText}`;
}

// Función para capitalizar texto
function capitalizeText(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function Ingredients({ recipe }: IngredientsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const { askAboutStep } = useAI(recipe);
  
  // Obtener el valor guardado o usar 2 como default
  const initialServings = Number(localStorage.getItem('preferred_servings')) || 2;
  const [servings, setServings] = useState(initialServings);
  const multiplier = servings / (recipe.servings || 1);

  // Guardar la preferencia del usuario cuando cambie
  const handleServingsChange = (newServings: number) => {
    setServings(newServings);
    localStorage.setItem('preferred_servings', newServings.toString());
  };

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
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-3 rounded-xl shadow-sm border border-rose-100/50">
              <Soup size={24} className="text-rose-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 text-lg">Ingredientes</h2>
              <span className="text-sm text-gray-500">
                {checkedIngredients.size} de {recipe.recipe_ingredients.length}
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-400 to-orange-500 transition-all duration-300"
              style={{ width: `${(checkedIngredients.size / recipe.recipe_ingredients.length) * 100}%` }}
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between w-full px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100">
              <span className="text-sm text-gray-700 font-medium">Cantidades para</span>
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-rose-500" />
                <select
                  value={servings}
                  onChange={(e) => handleServingsChange(Number(e.target.value))}
                  className="bg-transparent text-gray-900 font-medium focus:outline-none text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} personas</option>
                  ))}
                </select>
              </div>
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
                  const isChecked = checkedIngredients.has(ri.id);
                  const quantity = ri.quantity * multiplier;

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
                          {capitalizeText(ri.ingredient.name)}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        isChecked ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {formatQuantityAndUnit(quantity, ri.unit)}
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