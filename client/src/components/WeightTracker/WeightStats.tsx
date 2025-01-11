import React from 'react';
import { TrendingDown, TrendingUp, Scale, Target, Activity, Pencil } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="bg-rose-50 p-1.5 md:p-2 rounded-lg md:rounded-xl">
            <Scale size={16} className="text-rose-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Peso actual</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{currentWeight} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-orange-50 p-1.5 md:p-2 rounded-lg md:rounded-xl">
              <Target size={16} className="text-orange-500 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Objetivo</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{targetWeight} kg</p>
            </div>
          </div>
          <button
            onClick={onEditTarget}
            className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Pencil size={16} className="text-orange-500" />
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${isGaining ? 'bg-red-50' : 'bg-green-50'}`}>
            {isGaining ? (
              <TrendingUp size={16} className={`text-red-500 md:w-5 md:h-5`} />
            ) : (
              <TrendingDown size={16} className={`text-green-500 md:w-5 md:h-5`} />
            )}
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Cambio</p>
            <p className={`text-lg md:text-xl font-bold ${
              isGaining ? 'text-red-500' : 'text-green-500'
            }`}>
              {isGaining ? '+' : ''}{weightChange} kg
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-rose-100/20">
        <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
          <div className="bg-blue-50 p-1.5 md:p-2 rounded-lg md:rounded-xl">
            <Activity size={16} className="text-blue-500 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Progreso</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}