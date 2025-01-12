import React from 'react';
import { Clock, Users, ChefHat, X, Heart, Calendar, Flame, Leaf, Cookie, Beef, Scale, Soup, UtensilsCrossed } from 'lucide-react';
import { Recipe, RecipeCardProps } from '../types';

interface RecipeModalProps {
  recipe: RecipeCardProps['recipe'];
  onClose: () => void;
  onAddToMenu: (recipe: Recipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const mapToRecipe = (cardRecipe: RecipeCardProps['recipe']): Recipe => ({
  id: cardRecipe.id,
  side_dish: cardRecipe.side_dish,
  meal_type: cardRecipe.meal_type,
  category: cardRecipe.category,
  servings: cardRecipe.servings,
  calories: cardRecipe.calories,
  prep_time: cardRecipe.prep_time,
  energy_kj: cardRecipe.energy_kj,
  fats: cardRecipe.fats,
  saturated_fats: cardRecipe.saturated_fats,
  carbohydrates: cardRecipe.carbohydrates,
  sugars: cardRecipe.sugars,
  fiber: cardRecipe.fiber,
  proteins: cardRecipe.proteins,
  sodium: cardRecipe.sodium,
  instructions: cardRecipe.instructions,
  url: cardRecipe.url,
  pdf_url: cardRecipe.pdf_url,
  image_url: cardRecipe.image_url,
  created_at: cardRecipe.created_at,
  name: cardRecipe.name,
  updated_at: cardRecipe.updated_at
});

export function RecipeModal({ 
  recipe, 
  onClose, 
  onAddToMenu, 
  isFavorite, 
  onToggleFavorite 
}: RecipeModalProps) {
  const instructions = recipe.instructions as Record<string, string> || {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Imagen de la receta */}
        {recipe.image_url && (
          <div className="relative w-full aspect-video">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pr-8">{recipe.name}</h2>
              {recipe.side_dish && (
                <p className="text-gray-600 mt-1">{recipe.side_dish}</p>
              )}
            </div>
            <div className="flex space-x-2">
              {onToggleFavorite && (
                <button 
                  className={`p-2.5 rounded-xl transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-500'
                      : 'hover:bg-rose-50 text-gray-400 hover:text-rose-500'
                  }`}
                  onClick={onToggleFavorite}
                >
                  <Heart size={24} className={isFavorite ? 'fill-current' : ''} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Users size={18} className="mr-2 text-rose-500" />
              <span>{recipe.servings} personas</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Clock size={18} className="mr-2 text-rose-500" />
              <span>{recipe.prep_time || "30 min"}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <ChefHat size={18} className="mr-2 text-rose-500" />
              <span>{recipe.category}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-2xl border border-rose-100/50">
              <h3 className="font-semibold text-lg mb-4 text-rose-800 flex items-center">
                <Scale size={20} className="mr-2" />
                Información Nutricional
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Flame size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Calorías</p>
                      <p className="font-medium">{recipe.calories}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Beef size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Proteínas</p>
                      <p className="font-medium">{recipe.proteins}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Cookie size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Carbohidratos</p>
                      <p className="font-medium">{recipe.carbohydrates}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Leaf size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Grasas</p>
                      <p className="font-medium">{recipe.fats}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-rose-50 p-6 rounded-2xl border border-rose-100/50">
              <h3 className="font-semibold text-lg mb-4 text-rose-800 flex items-center">
                <UtensilsCrossed size={20} className="mr-2" />
                Detalles de Preparación
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <ChefHat size={16} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-600">Categoría</p>
                    <p className="font-medium text-gray-900">{recipe.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Soup size={16} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-600">Tipo</p>
                    <p className="font-medium text-gray-900">{recipe.meal_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Users size={16} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-600">Comensales</p>
                    <p className="font-medium text-gray-900">{recipe.servings} personas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(instructions).length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-4 text-gray-900 flex items-center">
                <UtensilsCrossed size={24} className="mr-2 text-rose-500" />
                Instrucciones
              </h3>
              <div className="space-y-4">
                {Object.entries(instructions).map(([paso, instruccion]) => (
                  <div key={paso} className="bg-gradient-to-br from-gray-50 to-rose-50 p-6 rounded-2xl border border-rose-100/50">
                    <div className="flex items-center mb-2">
                      <div className="bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center font-semibold mr-3">
                        {paso.replace('Paso ', '')}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-11">{instruccion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onAddToMenu && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-rose-100">
              <button 
                onClick={() => onAddToMenu(mapToRecipe(recipe))}
                className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Calendar size={20} />
                <span>Añadir al Menú</span>
              </button>
              {recipe.url && (
                <a 
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none bg-white text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 border border-gray-200"
                >
                  <ChefHat size={20} />
                  <span>Ver Receta Original</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}