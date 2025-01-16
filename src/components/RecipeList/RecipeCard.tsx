import React, { useState } from 'react';
import { Clock, Users, ChefHat, Flame, Heart, Sun, Moon } from 'lucide-react';
import type { Recipe } from '../../types';
import { categoryColors } from '../../utils/categoryColors';
import { RecipeModal } from './RecipeModal';

interface RecipeCardProps {
  recipe: Recipe;
  favorites: string[];
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function RecipeCard({ recipe, favorites, onClick, onToggleFavorite }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modificar la verificación de isFavorite
  const isFavorite = favorites?.includes(recipe.id);

  const colors = categoryColors[recipe.category as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
    hover: 'hover:bg-gray-100'
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    setShowModal(true);
    if (onClick) onClick();
  };

  const getImageUrl = (url: string, options: { width?: number, quality?: number, format?: string } = {}) => {
    const { width = 400, quality = 80, format = 'webp' } = options;
    return `${url}?quality=${quality}&width=${width}&format=${format}`;
  };

  return (
    <>
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-rose-100/20 group"
        onClick={handleCardClick}
      >
        {/* Image container with fixed aspect ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50">
          {recipe.image_url && !imageError ? (
            <>
              {/* Low quality placeholder */}
              <div 
                className={`absolute inset-0 bg-cover bg-center blur-lg scale-110 transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  backgroundImage: `url(${getImageUrl(recipe.image_url, { width: 50, quality: 10 })})` 
                }}
              />
              
              {/* Main image with srcset */}
              <picture>
                {/* WebP version */}
                <source
                  type="image/webp"
                  srcSet={`
                    ${getImageUrl(recipe.image_url, { width: 300, format: 'webp' })} 300w,
                    ${getImageUrl(recipe.image_url, { width: 600, format: 'webp' })} 600w
                  `}
                  sizes="(max-width: 768px) 300px, 600px"
                />
                {/* Fallback version */}
                <img
                  src={getImageUrl(recipe.image_url, { width: 400 })}
                  alt={recipe.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </picture>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat size={32} className="text-rose-300" />
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Toggle favorite:', { recipe, isFavorite, favorites });
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
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
                {recipe.name}
              </h3>
              {recipe.side_dish && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{recipe.side_dish}</p>
              )}
            </div>
          </div>
          
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
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} shadow-sm`}>
                {recipe.category}
              </span>
              {recipe.calories && (
                <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 shadow-sm">
                  <Flame size={12} className="text-rose-500" />
                  <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
                </div>
              )}
            </div>
            <div className={`p-1.5 rounded-lg border shadow-sm ${
              recipe.meal_type === 'comida' 
                ? 'bg-amber-50 text-amber-500 border-amber-200'
                : 'bg-indigo-50 text-indigo-500 border-indigo-200'
            }`}>
              {recipe.meal_type === 'comida' ? <Sun size={16} /> : <Moon size={16} />}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      {showModal && (
        <RecipeModal
          recipe={recipe}
          onClose={() => setShowModal(false)}
          onAddToMenu={() => {}}
          isFavorite={isFavorite}
          onToggleFavorite={() => onToggleFavorite()}
        />
      )}
    </>
  );
}

export const mapRecipeToCardProps = (recipe: Recipe): Recipe => ({
  ...recipe,
  recipe_ingredients: recipe.recipe_ingredients?.map((ri: any) => ({
    ...ri,
    ingredients: ri.ingredients
  })) || []
});