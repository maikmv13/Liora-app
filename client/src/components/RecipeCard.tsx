import React from 'react';
import { Clock, Users, ChefHat, Flame, Heart, Sun, Moon } from 'lucide-react';
import { Recipe, RecipeCardProps } from '../types';
import { categoryColors } from '../utils/categoryColors';
import { supabase } from '../lib/supabase';

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  console.log('Recipe data:', JSON.stringify(recipe, null, 2));
  console.log('Image URL:', recipe.image_url);
  console.log('Full image path:', `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/recipes/${recipe.image_url}`);

  const colors = categoryColors[recipe.category as keyof typeof categoryColors] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
    hover: 'hover:bg-gray-100'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden border-2 border-rose-100/20 group">
      {/* Imagen de la receta */}
      <div className="relative aspect-video w-full overflow-hidden">
        {recipe.image_url && typeof recipe.image_url === 'string' ? (
          <img
            src={recipe.image_url.startsWith('http')
              ? recipe.image_url 
              : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/recipes/${recipe.image_url}`
            }
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.parentElement?.classList.add('fallback-image');
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
            <ChefHat size={32} className="text-rose-300" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 p-2 rounded-xl transition-colors ${
            recipe.isFavorite
              ? 'text-rose-500 bg-white/90 backdrop-blur-sm hover:bg-white'
              : 'text-white/90 hover:text-white bg-black/20 hover:bg-black/30'
          }`}
        >
          <Heart size={20} className={recipe.isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-4" onClick={onClick}>
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
          <div className="flex items-center">
            <ChefHat size={14} className="mr-1" />
            <span>{recipe.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border-2 ${colors.border} shadow-sm`}>
              {recipe.category}
            </span>
            <div className="flex items-center space-x-1 bg-rose-50 px-2 py-1 rounded-lg border-2 border-rose-200 shadow-sm">
              <Flame size={12} className="text-rose-500" />
              <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
            </div>
          </div>
          <div className={`p-1.5 rounded-lg border-2 shadow-sm ${
            recipe.meal_type === 'comida' 
              ? 'bg-amber-50 text-amber-500 border-amber-200'
              : 'bg-indigo-50 text-indigo-500 border-indigo-200'
          }`}>
            {recipe.meal_type === 'comida' ? <Sun size={16} /> : <Moon size={16} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export const mapRecipeToCardProps = (recipe: any): Recipe => ({
  id: recipe.id,
  name: recipe.name,
  side_dish: recipe.side_dish,
  meal_type: recipe.meal_type,
  category: recipe.category,
  servings: recipe.servings,
  calories: recipe.calories,
  prep_time: recipe.prep_time,
  energy_kj: recipe.energy_kj,
  fats: recipe.fats,
  saturated_fats: recipe.saturated_fats,
  carbohydrates: recipe.carbohydrates,
  sugars: recipe.sugars,
  fiber: recipe.fiber,
  proteins: recipe.proteins,
  sodium: recipe.sodium,
  instructions: recipe.instructions,
  url: recipe.url,
  pdf_url: recipe.pdf_url,
  image_url: recipe.image_url,
  created_at: recipe.created_at,
  updated_at: recipe.updated_at
});