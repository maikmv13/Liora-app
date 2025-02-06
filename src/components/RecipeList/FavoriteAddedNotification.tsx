import React, { useEffect } from 'react';
import { Heart, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoriteAddedNotificationProps {
  recipeName: string;
  onClose: () => void;
}

export function FavoriteAddedNotification({ recipeName, onClose }: FavoriteAddedNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ 
        type: "spring", 
        stiffness: 400,
        damping: 40,
        duration: 0.6
      }}
      className="fixed top-4 left-1/2 z-[9999] transform -translate-x-1/2 w-[90%] max-w-md"
    >
      <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3 border border-rose-100">
        <div className="relative">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-red-500 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
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
            <Sparkles size={8} className="text-amber-500" />
          </motion.div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">¡Receta añadida!</h4>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-rose-500">{recipeName}</span> se añadió a tus favoritos
          </p>
        </div>
      </div>
    </motion.div>
  );
} 