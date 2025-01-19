import React, { useState } from 'react';
import { UtensilsCrossed, Check, ChevronDown, Lightbulb } from 'lucide-react';
import type { Recipe } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { useAI } from '../../../hooks/useAI';

type InstructionsProps = Readonly<{
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}>;

export function Instructions({ recipe }: Omit<InstructionsProps, 'isExpanded' | 'onToggle'>) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loadingSteps, setLoadingSteps] = useState<Set<number>>(new Set());
  const instructions = recipe.instructions as Record<string, string>;
  const { askAboutStep } = useAI(recipe);

  const handleToggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const handleAskAboutStep = async (stepIndex: number, instruction: string) => {
    try {
      setLoadingSteps(prev => new Set(prev).add(stepIndex));
      await askAboutStep(stepIndex + 1, instruction);
    } finally {
      setLoadingSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepIndex);
        return newSet;
      });
    }
  };

  if (!instructions || Object.keys(instructions).length === 0) {
    return null;
  }

  const totalSteps = Object.keys(instructions).length;
  const completedCount = completedSteps.size;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <UtensilsCrossed size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Instrucciones</h2>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {completedCount}/{totalSteps}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {Object.entries(instructions).map(([key, instruction], index) => {
            const isCompleted = completedSteps.has(index);
            const isLoading = loadingSteps.has(index);
            
            return (
              <div
                key={key}
                className="relative group"
              >
                <div className={`
                  relative rounded-xl transition-colors
                  ${isCompleted
                    ? 'bg-emerald-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}>
                  <button
                    onClick={() => handleToggleStep(index)}
                    className="w-full flex items-start space-x-3 p-4 text-left"
                  >
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5
                      ${isCompleted
                        ? 'bg-emerald-500 border-transparent'
                        : 'border-gray-300 bg-white'
                      }
                    `}>
                      {isCompleted ? (
                        <Check size={14} className="text-white" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-white' : 'text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p className={`flex-1 ${
                      isCompleted
                        ? 'text-emerald-800 line-through'
                        : 'text-gray-700'
                    }`}>
                      {instruction}
                    </p>
                  </button>

                  {/* Botón flotante de consulta */}
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleAskAboutStep(index, instruction);
                    }}
                    disabled={isLoading}
                    className={`
                      absolute -top-2 -right-2 p-2 shadow-lg 
                      rounded-full transition-all duration-200 z-10
                      opacity-0 group-hover:opacity-100
                      ${isLoading 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-rose-100 hover:bg-rose-200'
                      }
                      hover:shadow-md active:scale-95
                    `}
                    title={isLoading ? 'Enviando consulta...' : 'Preguntar sobre este paso'}
                  >
                    <Lightbulb 
                      size={16} 
                      className={isLoading ? 'text-gray-400' : 'text-rose-500'}
                    />
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}