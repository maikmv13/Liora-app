import React from 'react';
import { ChefHat, Flame } from 'lucide-react';
import type { Recipe } from '../../../types';

interface HeroImageProps {
  recipe: Recipe;
}

export function HeroImage({ recipe }: HeroImageProps) {
  return (
    <div className="relative w-full aspect-[16/9]">
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ChefHat size={48} className="text-gray-300" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* Recipe Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h1 className="text-2xl font-bold text-white mb-1">{recipe.name}</h1>
        {recipe.side_dish && (
          <p className="text-white/90">{recipe.side_dish}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
            {recipe.category}
          </span>
          {recipe.calories && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
              <Flame size={14} />
              <span>{recipe.calories}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}