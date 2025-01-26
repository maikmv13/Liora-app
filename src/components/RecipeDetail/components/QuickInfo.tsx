import React from 'react';
import { Clock, ChefHat } from 'lucide-react';
import type { Recipe } from '../../../types';

interface QuickInfoProps {
  recipe: Recipe;
}

export function QuickInfo({ recipe }: QuickInfoProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/20 p-3 md:p-6">
      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {/* Tiempo */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-2 md:p-4 border border-amber-100/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 md:p-2 bg-white/50 rounded-lg">
              <Clock size={16} className="text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-medium text-amber-700">Tiempo</span>
              <p className="text-sm md:text-lg font-semibold text-amber-900">
                {recipe.prep_time || "30 min"}
              </p>
            </div>
          </div>
        </div>

        {/* Dificultad */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-2 md:p-4 border border-emerald-100/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 md:p-2 bg-white/50 rounded-lg">
              <ChefHat size={16} className="text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-medium text-emerald-700">Dificultad</span>
              <p className="text-sm md:text-lg font-semibold text-emerald-900 capitalize">
                Media
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mt-3 md:mt-4 flex flex-wrap gap-1.5 md:gap-2">
          {recipe.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              className="inline-flex items-center space-x-1 px-2 md:px-3 py-1 md:py-1.5 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-lg text-xs md:text-sm border border-gray-200/50"
            >
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}