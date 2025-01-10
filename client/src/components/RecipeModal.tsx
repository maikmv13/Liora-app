import React from 'react';
import { Recipe } from '../types';
import { 
  Clock, Users, ChefHat, X, Heart, Calendar, 
  Flame, Leaf, Cookie, Beef, Scale, Soup, 
  UtensilsCrossed, ChevronRight
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToMenu: (recipe: Recipe) => void;
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
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-rose-100/20">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100/20 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pr-8">{recipe.Plato}</h2>
              <p className="text-gray-600 mt-1">{recipe.Acompañamiento}</p>
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
              <span>{recipe.Comensales} personas</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Clock size={18} className="mr-2 text-rose-500" />
              <span>{recipe["Tiempo de preparación"] || "30 min"}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <ChefHat size={18} className="mr-2 text-rose-500" />
              <span>{recipe.Categoria}</span>
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
                      <p className="font-medium">{recipe.Calorias}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Beef size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Proteínas</p>
                      <p className="font-medium">{recipe.Proteínas}</p>
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
                      <p className="font-medium">{recipe.Carbohidratos}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <Leaf size={16} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-rose-600">Grasas</p>
                      <p className="font-medium">{recipe.Grasas}</p>
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
                    <p className="font-medium text-gray-900">{recipe.Categoria}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Soup size={16} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-600">Tipo</p>
                    <p className="font-medium text-gray-900">{recipe.Tipo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-xl">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Users size={16} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-600">Comensales</p>
                    <p className="font-medium text-gray-900">{recipe.Comensales} personas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4 text-gray-900 flex items-center">
              <UtensilsCrossed size={24} className="mr-2 text-rose-500" />
              Ingredientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-rose-50 p-6 rounded-2xl border border-rose-100/50">
              {recipe.Ingredientes.map((ing) => (
                <div key={ing.Nombre} className="flex justify-between items-center py-2 px-4 bg-white/50 rounded-xl hover:bg-white transition-colors">
                  <span className="text-gray-800">{ing.Nombre}</span>
                  <span className="text-gray-600 font-medium">
                    {ing.Cantidad} {ing.Unidad}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4 text-gray-900 flex items-center">
              <ChefHat size={24} className="mr-2 text-rose-500" />
              Instrucciones
            </h3>
            <div className="space-y-4">
              {Object.entries(recipe.Instrucciones).map(([paso, instruccion]) => (
                <div key={paso} className="group bg-gradient-to-br from-gray-50 to-rose-50 p-6 rounded-2xl border border-rose-100/50 hover:from-rose-50 hover:to-orange-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center font-semibold mr-3">
                      {paso.replace('Paso ', '')}
                    </div>
                    <ChevronRight size={20} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-11">{instruccion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-rose-100">
            <button 
              onClick={() => onAddToMenu(recipe)}
              className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Calendar size={20} />
              <span>Añadir al Menú</span>
            </button>
            {recipe.PDF_Url && (
              <a 
                href={recipe.PDF_Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none bg-white text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 border border-gray-200"
              >
                <ChefHat size={20} />
                <span>Ver Receta Original</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}