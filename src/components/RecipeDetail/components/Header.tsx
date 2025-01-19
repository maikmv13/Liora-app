import React from 'react';
import { motion } from 'framer-motion';
import type { Recipe } from '../../../types';

interface HeaderProps {
  recipe: Recipe;
}

export function Header({ recipe }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50"
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="font-medium text-gray-900 line-clamp-1">
              {recipe.name}
            </h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
}