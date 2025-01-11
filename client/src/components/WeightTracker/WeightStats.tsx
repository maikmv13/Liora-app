import React from 'react';
import { Scale, Target, TrendingDown, TrendingUp, Activity } from 'lucide-react';

interface WeightStatsProps {
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  weightChange: number;
  onEditTarget: () => void;
}

export function WeightStats({ 
  currentWeight, 
  initialWeight, 
  targetWeight,
  weightChange,
  onEditTarget
}: WeightStatsProps) {
  const progress = Math.abs(((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100);
  const isGaining = weightChange > 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Progreso principal */}
      <div className="p-6 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Progreso hacia tu objetivo</h3>
              <p className="text-sm text-gray-600">
                {targetWeight > initialWeight ? 'Ganancia' : 'Pérdida'} de peso
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-transparent bg-clip-text">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-3 divide-x divide-rose-100/20">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Scale className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-medium text-gray-600">Actual</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentWeight} kg</p>
        </div>

        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Target className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-medium text-gray-600">Objetivo</span>
          </div>
          <button
            onClick={onEditTarget}
            className="text-xl font-bold text-gray-900 hover:text-rose-500 transition-colors"
          >
            {targetWeight} kg
          </button>
        </div>

        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            {isGaining ? (
              <TrendingUp className="w-5 h-5 text-red-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-600">Cambio</span>
          </div>
          <p className={`text-xl font-bold ${
            isGaining ? 'text-red-500' : 'text-green-500'
          }`}>
            {isGaining ? '+' : ''}{weightChange} kg
          </p>
        </div>
      </div>
    </div>
  );
}