import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../../../types';

interface RecipeMessageProps {
  recipe: Recipe;
  message?: string;
  onViewRecipe: (recipe: Recipe) => void;
  onShareRecipe: (recipe: Recipe) => void;
}

export function RecipeMessage({ recipe, message, onViewRecipe, onShareRecipe }: RecipeMessageProps) {
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

        <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
          <p className="text-gray-600 mt-1">{recipe.side_dish}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onViewRecipe(recipe)}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Ver Receta
            </button>
            <button
              onClick={() => onShareRecipe(recipe)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Compartir
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}