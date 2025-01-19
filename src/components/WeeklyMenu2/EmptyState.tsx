import React from 'react';
import { ChefHat, Heart } from 'lucide-react';

interface EmptyStateProps {
  onOpenWizard: () => void;
}

const EmptyStateButton = ({ onClick, className }: { onClick: () => void, className?: string }) => (
  <button
    onClick={onClick}
    className={`
      bg-rose-500 hover:bg-rose-600 
      text-white px-6 py-3 
      rounded-xl font-medium 
      flex items-center gap-2 
      transform transition 
      hover:scale-105 
      shadow-md hover:shadow-lg
      ${className}
    `}
  >
    Comenzar selección
    <Heart className="w-4 h-4" />
  </button>
);

export function EmptyState({ onOpenWizard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ChefHat className="w-16 h-16 text-rose-500" />
            <Heart className="w-8 h-8 text-rose-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ¡Personaliza tu experiencia culinaria! 🌟
        </h2>
        
        <div className="space-y-6">
          <p className="text-gray-600 text-lg leading-relaxed">
            Para crear tu menú semanal personalizado, necesitamos conocer tus preferencias.
            Marca como favoritas al menos <span className="font-semibold text-rose-500">2 recetas de cada tipo</span>:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            {['Desayuno', 'Comida', 'Cena', 'Snack'].map((tipo) => (
              <div key={tipo} className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-rose-100">
                <p className="text-gray-700 font-medium flex items-center">
                  <Heart className="w-4 h-4 text-rose-400 mr-2" />
                  {tipo}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <EmptyStateButton onClick={onOpenWizard} />
            <p className="text-sm text-gray-500">
              ¡Te ayudaremos a encontrar las recetas perfectas para ti!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 