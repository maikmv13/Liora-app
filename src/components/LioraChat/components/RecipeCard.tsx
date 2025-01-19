import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ChefHat, Share2, Eye, Bot, Sparkles, Flame } from 'lucide-react';
import type { Recipe } from '../../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onView: () => void;
  onShare: () => void;
  inChat?: boolean;
}

export function RecipeCard({ recipe, onView, onShare, inChat = false }: RecipeCardProps) {
  return (
    <div className="flex items-start space-x-2">
      {inChat && (
        <div className="relative flex-shrink-0">
          <div className="bg-rose-500/10 backdrop-blur-sm p-2 rounded-lg">
            <Bot size={16} className="text-rose-500" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-1 -right-1 bg-white rounded-full p-1"
          >
            <Sparkles size={8} className="text-rose-500" />
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          bg-white rounded-xl border border-rose-100 overflow-hidden shadow-sm
          hover:shadow-md transition-all duration-300
          ${inChat ? 'max-w-sm' : 'w-full'}
        `}
      >
        {/* Recipe Image */}
        <div className="relative aspect-[16/9] bg-gray-100">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat size={32} className="text-gray-400" />
            </div>
          )}
          {recipe.calories && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-rose-100 flex items-center space-x-1">
              <Flame size={14} className="text-rose-500" />
              <span className="text-xs font-medium text-rose-600">{recipe.calories}</span>
            </div>
          )}
        </div>

        {/* Recipe Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {recipe.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
              {recipe.category}
            </span>
            {recipe.side_dish && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-700">
                {recipe.side_dish}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{recipe.servings}</span>
              </div>
              {recipe.prep_time && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{recipe.prep_time}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onShare}
                className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-gray-400 hover:text-rose-500"
                title="Compartir receta"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={onView}
                className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-gray-400 hover:text-rose-500"
                title="Ver receta"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}