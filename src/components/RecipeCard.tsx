import React from 'react';
import { Clock, Users, ChefHat, Flame, Heart } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  return (
    <div 
      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-rose-100/20"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div onClick={onClick} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
              {recipe.Plato}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2 rounded-xl transition-colors ${
                recipe.isFavorite
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Heart size={20} className={recipe.isFavorite ? 'fill-current' : ''} />
            </button>
            <div className="bg-rose-50 px-2 py-1 rounded-lg">
              <Flame size={14} className="text-rose-500" />
            </div>
          </div>
        </div>
        
        <div onClick={onClick}>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Users size={14} className="mr-1 text-rose-400" />
              <span>{recipe.Comensales}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1 text-rose-400" />
              <span>30 min</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
              {recipe.Categoria}
            </span>
            <div className="bg-rose-50 p-1.5 rounded-lg">
              <ChefHat size={16} className="text-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}