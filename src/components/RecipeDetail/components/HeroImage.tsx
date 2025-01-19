import React from 'react';
import { ChefHat, Flame, ArrowLeft } from 'lucide-react';
import type { Recipe } from '../../../types';
import { motion } from 'framer-motion';

interface HeroImageProps {
  recipe: Recipe;
  onBack: () => void;
}

export function HeroImage({ recipe, onBack }: HeroImageProps) {
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
      
      {/* Recipe Title con botón de volver */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="p-2 mb-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-xl text-white transition-colors"
        >
          <ArrowLeft size={15} />
        </motion.button>

        <h1 className="text-2xl font-bold text-white mb-1">{recipe.name}</h1>
        
        {recipe.side_dish && (
          <p className="text-white/90">{recipe.side_dish}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
            {recipe.category}
          </span>
          {recipe.calories && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg">
              <Flame size={14} />
              <span>{recipe.calories}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}