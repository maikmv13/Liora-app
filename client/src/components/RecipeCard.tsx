import React from 'react';
import { Clock, Users, ChefHat, Flame, Heart, Sun, Moon } from 'lucide-react';
import { Database } from '../types/supabase';
import { categoryColors } from '../utils/categoryColors';

type RecipeCardProps = Readonly<{
  recipe: Database['public']['Tables']['recipes']['Row'] & { isFavorite?: boolean };
  onClick: () => void;
  onToggleFavorite: () => void;
}>;

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  const colors = categoryColors[recipe.category as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
    hover: 'hover:bg-gray-100'
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 border border-rose-100/20 overflow-hidden">
      {/* Imagen de la receta */}
      <div className="relative aspect-[21/9] overflow-hidden">
        {recipe.image_url ? (
          <>
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
            <ChefHat size={48} className="text-rose-200" />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <button 
            onClick={onClick} 
            className="flex-1 text-left"
            aria-label={`Ver receta ${recipe.name}`}
          >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
              {recipe.name}
            </h3>
            {recipe.side_dish && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{recipe.side_dish}</p>
            )}
          </button>
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
        
        <button 
          onClick={onClick}
          className="block w-full"
          aria-label="Ver detalles de la receta"
        >
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{recipe.prep_time || "30 min"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                {recipe.category}
              </span>
              <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                <Flame size={12} className="text-rose-500" />
                <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
              </div>
            </div>
            <div className={`p-1.5 rounded-lg border shadow-sm ${
              recipe.meal_type === 'comida' 
                ? 'bg-amber-50 text-amber-500 border-amber-200'
                : 'bg-indigo-50 text-indigo-500 border-indigo-200'
            }`}>
              {recipe.meal_type === 'comida' ? <Sun size={16} /> : <Moon size={16} />}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}