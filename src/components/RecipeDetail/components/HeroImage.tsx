import React from 'react';
import { ChefHat, Flame, Heart, Share2 } from 'lucide-react';
import type { Recipe } from '../../../types';
import { motion } from 'framer-motion';

interface HeroImageProps {
  recipe: Recipe;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function HeroImage({ recipe, onToggleFavorite, isFavorite }: HeroImageProps) {
  return (
    <div className="relative w-full aspect-[16/9]">
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ChefHat size={48} className="text-gray-300" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />

      {/* Recipe Title and Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="leading-tight">
          <h1 className="text-2xl font-bold text-white inline">{recipe.name}</h1>
          
          {recipe.side_dish && (
            <span className="text-lg text-white/90"> {recipe.side_dish}</span>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
            {recipe.category}
          </span>
          {recipe.calories && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
              <Flame size={14} />
              <span>{recipe.calories} kcal</span>
            </span>
          )}
          
          {/* Botones de acción */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggleFavorite}
            className={`flex items-center space-x-1 px-2 py-1 backdrop-blur-sm rounded-lg transition-colors ${
              isFavorite 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            <span className="text-sm">{isFavorite ? 'Guardado' : 'Guardar'}</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              // Implement share functionality
            }}
            className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors"
          >
            <Share2 size={14} />
            <span className="text-sm">Compartir</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}