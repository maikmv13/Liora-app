import React from 'react';
import { Database } from '../types/supabase';
import { 
  Clock, Users, ChefHat, X, Heart, Calendar, 
  Flame, Leaf, Cookie, Beef, Scale, Soup, 
  UtensilsCrossed, ChevronRight
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Database['public']['Tables']['recipes']['Row'];
  onClose: () => void;
  onAddToMenu: (recipe: Database['public']['Tables']['recipes']['Row']) => void;
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
        {/* Imagen de la receta */}
        {recipe.image_url && (
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
              {recipe.side_dish && (
                <p className="text-white/90">{recipe.side_dish}</p>
              )}
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100/20 p-6">
          {!recipe.image_url && (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 pr-8">{recipe.name}</h2>
                <p className="text-gray-600 mt-1">{recipe.side_dish}</p>
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
          )}
          
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
        
        {/* Resto del contenido del modal... */}
      </div>
    </div>
  );
}