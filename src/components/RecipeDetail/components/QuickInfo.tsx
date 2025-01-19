import React from 'react';
import { 
  Clock, Users, ChefHat, Flame, 
  Leaf, Cookie, Beef, Scale, Soup, UtensilsCrossed,
  Dumbbell, Apple, Wheat, CircleDot
} from 'lucide-react';
import type { Recipe } from '../../../types';

interface QuickInfoProps {
  recipe: Recipe;
}

export function QuickInfo({ recipe }: QuickInfoProps) {
  return (
    <div className="px-4 py-6 md:py-8">
      {/* Grid principal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tiempo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-orange-50 rounded-xl">
            <Clock size={16} className="text-orange-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Tiempo</p>
            <p className="text-sm md:text-base font-medium text-gray-900">
              {recipe.prep_time || "30 min"}
            </p>
          </div>
        </div>

        {/* Raciones */}
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-blue-50 rounded-xl">
            <Users size={16} className="text-blue-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Porciones</p>
            <p className="text-sm md:text-base font-medium text-gray-900">
              {recipe.servings}
            </p>
          </div>
        </div>

        {/* Dificultad */}
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-rose-50 rounded-xl">
            <ChefHat size={16} className="text-rose-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Dificultad</p>
            <p className="text-sm md:text-base font-medium text-gray-900 capitalize">
              Media
            </p>
          </div>
        </div>

        {/* Calorías */}
        <div className="flex items-center space-x-3">
          <div className="p-2 md:p-3 bg-purple-50 rounded-xl">
            <Scale size={16} className="text-purple-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Calorías</p>
            <p className="text-sm md:text-base font-medium text-gray-900">
              {recipe.calories || '~'} kcal
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => {
            const Icon = getTagIcon(tag);
            return (
              <span 
                key={index}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm"
              >
                <Icon size={14} className="text-gray-500" />
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