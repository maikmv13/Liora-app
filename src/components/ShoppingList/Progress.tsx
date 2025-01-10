import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProgressProps {
  total: number;
  completed: number;
}

export function Progress({ total, completed }: ProgressProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="bg-rose-50 p-1.5 md:p-2 rounded-lg md:rounded-xl">
            <ShoppingCart size={16} className="text-rose-500 md:w-5 md:h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm md:text-base">Progreso</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {total === 0 
                ? 'No hay items'
                : `${completed} de ${total} items`
              }
            </p>
          </div>
        </div>
        <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-transparent bg-clip-text">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
        <div 
          className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}