import React, { useState } from 'react';
import { UtensilsCrossed, Check, ChevronDown, Lightbulb } from 'lucide-react';
import type { Recipe } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { useAI } from '../../../hooks/useAI';

type InstructionsProps = Readonly<{
  recipe: Recipe;
}>;

export function Instructions({ recipe }: InstructionsProps) {
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
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/20">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl shadow-sm border border-blue-100/50">
            <UtensilsCrossed size={24} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-lg">Instrucciones</h2>
              <span className="text-sm text-gray-500 whitespace-nowrap bg-blue-50 px-2 py-1 rounded-lg">
                {completedCount}/{totalSteps}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(instructions).map(([key, instruction], index) => {
            const isCompleted = completedSteps.has(index);
            const isLoading = loadingSteps.has(index);
            
            return (
              <div
                key={key}
                className="relative group"
              >
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? 'rgb(240 253 244)' : 'rgb(249 250 251)'
                  }}
                  className="relative rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => handleToggleStep(index)}
                    className="w-full flex items-start space-x-4 p-4 text-left"
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center mt-0.5
                      transition-all duration-300
                      ${isCompleted
                        ? 'bg-emerald-500 border-transparent'
                        : 'border-gray-300 bg-white hover:border-emerald-300'
                      }
                    `}>
                      {isCompleted ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-white' : 'text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p className={`flex-1 transition-all duration-300 ${
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
                      rounded-xl transition-all duration-200 z-10
                      opacity-0 group-hover:opacity-100
                      ${isLoading 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:shadow-xl'
                      }
                      hover:shadow-md active:scale-95
                    `}
                    title={isLoading ? 'Enviando consulta...' : 'Preguntar sobre este paso'}
                  >
                    <Lightbulb 
                      size={16} 
                      className={isLoading ? 'text-gray-400' : 'text-white'}
                    />
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}