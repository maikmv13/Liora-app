import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { RecipeCard } from './RecipeCard';
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

        <RecipeCard
          recipe={recipe}
          onView={() => onViewRecipe(recipe)}
          onShare={() => onShareRecipe(recipe)}
          inChat
        />
      </div>
    </motion.div>
  );
}