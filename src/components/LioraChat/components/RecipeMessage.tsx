import React, { useState } from 'react';
import { Bot, Clock, Users, Flame, Heart, Share2, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../../../types';
import { categoryColors } from '../../../utils/categoryColors';

interface RecipeMessageProps {
  recipe: Recipe;
  message?: string;
  favorites: string[];
  onViewRecipe: (recipe: Recipe) => void;
  onShareRecipe: (recipe: Recipe) => void;
  onToggleFavorite: () => void;
}

export function RecipeMessage({ 
  recipe, 
  message, 
  favorites,
  onViewRecipe, 
  onShareRecipe,
  onToggleFavorite 
}: RecipeMessageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isFavorite = favorites?.includes(recipe.id);

  const colors = categoryColors[recipe.category as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100'
  };

  const getImageUrl = (url: string, options: { width?: number, quality?: number, format?: string } = {}) => {
    const { width = 400, quality = 80, format = 'webp' } = options;
    return `${url}?quality=${quality}&width=${width}&format=${format}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-3"
    >
      <div className="relative">
        <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-2 rounded-xl shadow-sm">
          <Bot size={16} className="text-rose-500" />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {message && (
          <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
            <p className="text-gray-700">{message}</p>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-rose-100/20 overflow-hidden">
          {/* Image Section */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50">
            {recipe.image_url && !imageError ? (
              <>
                <div 
                  className={`absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ 
                    backgroundImage: `url(${getImageUrl(recipe.image_url, { width: 50, quality: 10 })})` 
                  }}
                />
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`
                      ${getImageUrl(recipe.image_url, { width: 300, format: 'webp' })} 300w,
                      ${getImageUrl(recipe.image_url, { width: 600, format: 'webp' })} 600w
                    `}
                    sizes="(max-width: 768px) 300px, 600px"
                  />
                  <img
                    src={getImageUrl(recipe.image_url, { width: 400 })}
                    alt={recipe.name}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </picture>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ChefHat size={32} className="text-rose-300" />
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`absolute top-2 right-2 p-2 rounded-xl transition-colors ${
                isFavorite
                  ? 'text-rose-500 bg-white/90 backdrop-blur-sm hover:bg-white'
                  : 'text-white/90 hover:text-white bg-black/20 hover:bg-black/30'
              }`}
            >
              <Heart 
                size={20} 
                className={`transition-colors ${isFavorite ? 'fill-current text-rose-500' : ''}`} 
              />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">{recipe.name}</h3>
              {recipe.calories && (
                <div className="flex items-center space-x-2 bg-rose-50 px-2 py-1 rounded-lg ml-2">
                  <Flame size={14} className="text-rose-500" />
                  <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Users size={14} className="mr-1 text-rose-400" />
                <span>{recipe.servings}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1 text-rose-400" />
                <span>{recipe.prep_time || '30 min'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
                {recipe.category}
              </span>
            </div>
          </div>

          <div className="flex border-t border-rose-100/20 divide-x divide-rose-100/20">
            <button
              onClick={() => onViewRecipe(recipe)}
              className="flex-1 flex items-center justify-center space-x-1 p-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50/50 transition-colors"
            >
              <span>Ver Receta</span>
            </button>
            <button
              onClick={() => onShareRecipe(recipe)}
              className="flex-1 flex items-center justify-center space-x-1 p-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50/50 transition-colors"
            >
              <Share2 size={14} />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}