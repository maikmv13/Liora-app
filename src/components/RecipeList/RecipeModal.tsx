import React from 'react';
import { 
  Clock, Users, ChefHat, X, Heart, Calendar, 
  Flame, Leaf, Cookie, Beef, Scale, Soup, UtensilsCrossed,
  Dumbbell, Apple, Wheat, CircleDot
} from 'lucide-react';
import { Recipe } from '../../types';
import { getUnitPlural } from '../../utils/getUnitPlural';
import { getCuisineEmoji } from '../../types/categories';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToMenu?: (recipe: Recipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function RecipeModal({ 
  recipe, 
  onClose, 
  onAddToMenu,
  isFavorite,
  onToggleFavorite 
}: RecipeModalProps) {
  const getImageUrl = (url: string, options: { width?: number, quality?: number, format?: string } = {}) => {
    const { width = 800, quality = 80, format = 'webp' } = options;
    return `${url}?quality=${quality}&width=${width}&format=${format}`;
  };

  const instructions = recipe.instructions as Record<string, string> || {};

  // Nutritional info cards configuration
  const nutritionalInfo = [
    {
      label: 'Calorías',
      value: recipe.calories || '0 kcal',
      icon: Flame,
      color: 'rose'
    },
    {
      label: 'Proteínas',
      value: recipe.proteins || '0 g',
      icon: Dumbbell,
      color: 'emerald'
    },
    {
      label: 'Carbohidratos',
      value: recipe.carbohydrates || '0 g',
      icon: Cookie,
      color: 'amber'
    },
    {
      label: 'Grasas',
      value: recipe.fats || '0 g',
      icon: Leaf,
      color: 'blue'
    },
    {
      label: 'Fibra',
      value: recipe.fiber || '0 g',
      icon: Wheat,
      color: 'orange'
    },
    {
      label: 'Sodio',
      value: recipe.sodium || '0 mg',
      icon: CircleDot,
      color: 'purple'
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-4xl my-4 shadow-lg flex flex-col overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Recipe Image */}
        <div className="relative h-48 rounded-t-2xl overflow-hidden flex-shrink-0">
          {recipe.image_url ? (
            <>
              {/* Low quality placeholder */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
                style={{ 
                  backgroundImage: `url(${getImageUrl(recipe.image_url, { width: 50, quality: 10 })})`,
                  opacity: 0.5 
                }}
              />
              
              <picture>
                {/* WebP version */}
                <source
                  type="image/webp"
                  srcSet={`
                    ${getImageUrl(recipe.image_url, { width: 400, format: 'webp' })} 400w,
                    ${getImageUrl(recipe.image_url, { width: 800, format: 'webp' })} 800w
                  `}
                  sizes="(max-width: 768px) 400px, 800px"
                />
                {/* Fallback version */}
                <img
                  src={getImageUrl(recipe.image_url, { width: 800 })}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
              <ChefHat size={48} className="text-rose-300" />
            </div>
          )}
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Recipe title */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{recipe.name}</h2>
            {recipe.side_dish && (
              <p className="text-white/90 mt-1">{recipe.side_dish}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Users size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">{recipe.servings} personas</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Clock size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">{recipe.prep_time || "30 min"}</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <ChefHat size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">{recipe.category}</span>
              </div>
              {recipe.calories && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Flame size={18} className="text-gray-500" />
                  <span className="text-gray-700 font-medium">{recipe.calories}</span>
                </div>
              )}
              {recipe.cuisine_type && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-700 font-medium capitalize">
                    {getCuisineEmoji(recipe.cuisine_type)} {recipe.cuisine_type}
                  </span>
                </div>
              )}
            </div>

            {/* Nutritional Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale size={24} className="mr-2 text-rose-500" />
                Información Nutricional
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {nutritionalInfo.map(({ label, value, icon: Icon, color }) => (
                  <div 
                    key={label}
                    className={`bg-${color}-50 p-3 rounded-xl border border-${color}-100`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Icon size={18} className={`text-${color}-500 mb-1`} />
                      <p className={`text-${color}-900 font-semibold text-sm`}>{value}</p>
                      <p className={`text-${color}-600 text-xs`}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Soup size={24} className="mr-2 text-rose-500" />
                  Ingredientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.recipe_ingredients.map((ri, index) => {
                    if (!ri.ingredients) {
                      console.warn('Missing ingredient data:', ri);
                      return null;
                    }
                    
                    const unit = getUnitPlural(ri.unit, ri.quantity);
                    
                    return (
                      <div 
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="p-2 bg-white rounded-lg">
                          <ChefHat size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {ri.ingredients.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ri.quantity} {unit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Instructions */}
            {Object.keys(instructions).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UtensilsCrossed size={24} className="mr-2 text-rose-500" />
                  Instrucciones
                </h3>
                <div className="space-y-4">
                  {Object.entries(instructions).map(([key, instruccion], index) => (
                    <div key={key} className="bg-gradient-to-br from-gray-50 to-rose-50 p-6 rounded-2xl border border-rose-100/50">
                      <div className="flex items-center mb-2">
                        <div className="bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center font-semibold mr-3">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-11">{instruccion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row gap-3 p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm rounded-b-2xl">
          {onAddToMenu && (
            <button 
              onClick={() => onAddToMenu(recipe)}
              className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Calendar size={20} />
              <span>Añadir al Menú</span>
            </button>
          )}
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className={`w-full sm:w-auto py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 border shadow-sm ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
              <span>{isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}