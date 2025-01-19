import React from 'react';
import { Users, Clock, Scale } from 'lucide-react';
import type { Recipe } from '../../../types';

interface QuickInfoProps {
  recipe: Recipe;
}

export function QuickInfo({ recipe }: QuickInfoProps) {
  return (
    <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white">
      <div className="flex items-center p-3">
        <Users size={18} className="text-rose-400 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Porciones</p>
          <p className="font-medium">{recipe.servings}</p>
        </div>
      </div>
      <div className="flex items-center p-3 pl-4">
        <Clock size={18} className="text-rose-400 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Tiempo</p>
          <p className="font-medium">{recipe.prep_time || "30 min"}</p>
        </div>
      </div>
      <div className="flex items-center p-3 pl-4">
        <Scale size={18} className="text-rose-400 mr-2" />
        <div>
          <p className="text-xs text-gray-500">Dificultad</p>
          <p className="font-medium">Media</p>
        </div>
      </div>
    </div>
  );
}