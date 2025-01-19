import React, { useState } from 'react';
import { UtensilsCrossed, Check } from 'lucide-react';
import type { Recipe } from '../../../types';

interface InstructionsProps {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export function Instructions({ recipe, isExpanded, onToggle }: InstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const instructions = recipe.instructions as Record<string, string>;

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

  if (!instructions || Object.keys(instructions).length === 0) {
    return null;
  }

  const totalSteps = Object.keys(instructions).length;
  const completedCount = completedSteps.size;

  return (
    <div className="bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 border-t border-gray-100"
      >
        <div className="flex items-center space-x-2">
          <UtensilsCrossed size={20} className="text-rose-500" />
          <div>
            <h2 className="font-medium text-gray-900">Instrucciones</h2>
            <p className="text-sm text-gray-500">
              {completedCount} de {totalSteps} pasos completados
            </p>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {Object.entries(instructions).map(([key, instruction], index) => {
            const isCompleted = completedSteps.has(index);
            
            return (
              <button
                key={key}
                onClick={() => handleToggleStep(index)}
                className={`w-full flex items-start space-x-3 p-4 rounded-xl text-left transition-colors ${
                  isCompleted
                    ? 'bg-emerald-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}