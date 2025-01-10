import React from 'react';
import { Clock, Users, ChefHat, Flame, Heart, Sun, Moon } from 'lucide-react';
import { Recipe } from '../types';
import { categoryColors } from '../utils/categoryColors';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  const colors = categoryColors[recipe.Categoria as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
    hover: 'hover:bg-gray-100'
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden border-2 ${colors.border} group`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div onClick={onClick} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
              {recipe.Plato}
            </h3>
            {recipe.Acompañamiento && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{recipe.Acompañamiento}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2 rounded-xl transition-colors ${
                recipe.isFavorite
                  ? 'text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Heart size={20} className={recipe.isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
        
        <div onClick={onClick}>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Users size={14} className={`mr-1 ${colors.text}`} />
              <span>{recipe.Comensales}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className={`mr-1 ${colors.text}`} />
              <span>{recipe["Tiempo de preparación"] || "30 min"}</span>
            </div>
            <div className="flex items-center">
              <ChefHat size={14} className={`mr-1 ${colors.text}`} />
              <span>{recipe.Categoria}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border-2 ${colors.border} shadow-sm`}>
                {recipe.Categoria}
              </span>
              <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-lg border-2 border-rose-200 shadow-sm">
                <Flame size={12} className="text-rose-500" />
                <span className="text-xs font-medium text-rose-600">{recipe.Calorias}</span>
              </div>
            </div>
            <div className={`p-1.5 rounded-lg border-2 shadow-sm ${
              recipe.Tipo.toLowerCase() === 'comida' 
                ? 'bg-amber-50 text-amber-500 border-amber-200'
                : 'bg-indigo-50 text-indigo-500 border-indigo-200'
            }`}>
              {recipe.Tipo.toLowerCase() === 'comida' ? <Sun size={16} /> : <Moon size={16} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}