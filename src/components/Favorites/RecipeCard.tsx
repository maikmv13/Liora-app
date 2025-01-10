import React from 'react';
import { Clock, Users, ChefHat, Flame, Star, Edit2, Trash2 } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { categoryColors } from '../../utils/categoryColors';

interface RecipeCardProps {
  recipe: FavoriteRecipe;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export function RecipeCard({ recipe, onSelect, onEdit, onRemove }: RecipeCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short'
    }).format(new Date(dateString));
  };

  const colors = categoryColors[recipe.Categoria as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
    hover: 'hover:bg-gray-100'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all border border-rose-100/20 overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={onSelect}
            className="flex-1 text-left"
          >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
              {recipe.Plato}
            </h3>
          </button>
          <div className="flex items-center space-x-2 bg-rose-50 px-2 py-1 rounded-lg ml-2">
            <Flame size={14} className="text-rose-500" />
            <span className="text-xs font-medium text-rose-600">{recipe.Calorias}</span>
          </div>
        </div>
        
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

        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
            {recipe.Categoria}
          </span>
          {recipe.rating && (
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-gray-700">{recipe.rating}</span>
            </div>
          )}
        </div>

        {recipe.notes && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 italic">
            "{recipe.notes}"
          </p>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Añadida el {formatDate(recipe.addedAt)}</span>
          {recipe.lastCooked && (
            <span>Cocinada el {formatDate(recipe.lastCooked)}</span>
          )}
        </div>
      </div>

      <div className="flex border-t border-rose-100/20 divide-x divide-rose-100/20">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center space-x-1 p-2.5 text-sm font-medium text-gray-600 hover:bg-rose-50/50 transition-colors"
        >
          <Edit2 size={14} />
          <span>Editar</span>
        </button>
        <button
          onClick={onRemove}
          className="flex-1 flex items-center justify-center space-x-1 p-2.5 text-sm font-medium text-red-600 hover:bg-red-50/50 transition-colors"
        >
          <Trash2 size={14} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}