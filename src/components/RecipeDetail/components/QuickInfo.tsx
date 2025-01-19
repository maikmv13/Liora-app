import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import type { Recipe } from '../../../types';

interface QuickInfoProps {
  recipe: Recipe;
}

export function QuickInfo({ recipe }: QuickInfoProps) {
  return (
    <div className="px-4 py-3 md:py-4">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Tiempo */}
        <div className="text-center">
          <div className="mb-1">
            <p className="inline-flex items-center text-xs md:text-sm text-gray-500">
              <Clock size={12} className="mr-1" />
              Tiempo
            </p>
          </div>
          <p className="text-sm md:text-base font-medium text-gray-900">
            {recipe.prep_time || "30 min"}
          </p>
        </div>

        {/* Raciones */}
        <div className="text-center">
          <div className="mb-1">
            <p className="inline-flex items-center text-xs md:text-sm text-gray-500">
              <Users size={12} className="mr-1" />
              Porciones
            </p>
          </div>
          <p className="text-sm md:text-base font-medium text-gray-900">
            {recipe.servings}
          </p>
        </div>

        {/* Dificultad */}
        <div className="text-center">
          <div className="mb-1">
            <p className="inline-flex items-center text-xs md:text-sm text-gray-500">
              <ChefHat size={12} className="mr-1" />
              Dificultad
            </p>
          </div>
          <p className="text-sm md:text-base font-medium text-gray-900 capitalize">
            Media
          </p>
        </div>
      </div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag: string, index: number) => {
            const Icon = getTagIcon(tag);
            return (
              <span 
                key={index}
                className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs"
              >
                <Icon size={12} className="text-gray-400" />
                <span>{tag}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTagIcon(tag: string) {
  const tagIcons: Record<string, any> = {
    'vegetariano': Leaf,
    'postre': Cookie,
    'carne': Beef,
    'ligero': Scale,
    'sopa': Soup,
    'fácil': UtensilsCrossed,
    'proteína': Dumbbell,
    'fruta': Apple,
    'cereal': Wheat,
    'default': CircleDot
  };

  return tagIcons[tag.toLowerCase()] || tagIcons.default;
}