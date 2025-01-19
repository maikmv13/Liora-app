import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import type { Recipe } from '../../../types';

interface HeaderProps {
  onToggleFavorite: () => void;
  isFavorite: boolean;
  recipe: Recipe;
}

export function Header({ onToggleFavorite, isFavorite }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-end px-4 h-14">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => {
                // Implement share functionality
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}