import React from 'react';
import { X, Trophy, Target } from 'lucide-react';

interface WeightGoalAchievedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  onSetNewGoal: () => void;
}

export function WeightGoalAchievedModal({
  isOpen,
  onClose,
  currentWeight,
  targetWeight,
  onSetNewGoal
}: WeightGoalAchievedModalProps) {
  const isGaining = targetWeight > currentWeight;

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors ml-auto"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Felicidades! 🎉
          </h2>
          <p className="text-gray-600">
            Has alcanzado tu objetivo de {isGaining ? 'ganar' : 'perder'} peso
          </p>
          <div className="mt-4 p-4 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl">
            <p className="font-medium text-gray-900">
              Peso objetivo: {targetWeight} kg
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Peso actual: {currentWeight} kg
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSetNewGoal}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
          >
            <Target size={20} />
            <span>Establecer nuevo objetivo</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Continuar con el objetivo actual
          </button>
        </div>
      </div>
    </div>
  );
}