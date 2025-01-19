import React from 'react';
import { Scale, Flame, Cookie, Beef, Wheat, CircleDot } from 'lucide-react';
import type { Recipe } from '../../../types';

interface NutritionalInfoProps {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export function NutritionalInfo({ recipe, isExpanded, onToggle }: NutritionalInfoProps) {
  const nutritionalInfo = [
    { label: 'Calorías', value: recipe.calories || '0 kcal', icon: Flame, color: 'rose' },
    { label: 'Proteínas', value: recipe.proteins || '0 g', icon: Cookie, color: 'emerald' },
    { label: 'Carbohidratos', value: recipe.carbohydrates || '0 g', icon: Cookie, color: 'amber' },
    { label: 'Grasas', value: recipe.fats || '0 g', icon: Beef, color: 'blue' },
    { label: 'Fibra', value: recipe.fiber || '0 g', icon: Wheat, color: 'orange' },
    { label: 'Sodio', value: recipe.sodium || '0 mg', icon: CircleDot, color: 'purple' }
  ];

  return (
    <div className="bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 border-t border-gray-100"
      >
        <div className="flex items-center space-x-2">
          <Scale size={20} className="text-rose-500" />
          <h2 className="font-medium text-gray-900">Información Nutricional</h2>
        </div>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {nutritionalInfo.map(({ label, value, icon: Icon, color }) => (
            <div 
              key={label}
              className={`flex flex-col items-center p-3 bg-${color}-50 rounded-xl text-center`}
            >
              <Icon size={20} className={`text-${color}-500 mb-1`} />
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}