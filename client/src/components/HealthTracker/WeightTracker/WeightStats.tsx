import React, { useState, useEffect } from 'react';
import { Scale, Target, TrendingDown, TrendingUp, Activity, Trophy, Gift, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WeightStatsProps {
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  weightChange: number;
  onEditTarget: () => void;
  subGoals?: Array<{
    weight: number;
    description: string;
  }>;
}

export function WeightStats({ 
  currentWeight, 
  initialWeight, 
  targetWeight,
  weightChange,
  onEditTarget,
  subGoals = []
}: WeightStatsProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAchievedGoal, setLastAchievedGoal] = useState<{weight: number, description: string} | null>(null);

  const totalChange = Math.abs(targetWeight - initialWeight);
  const currentChange = Math.abs(currentWeight - initialWeight);
  const progress = (currentChange / totalChange) * 100;
  const isGaining = targetWeight > initialWeight;

  // Encontrar el siguiente sub-objetivo y el último alcanzado
  const nextGoal = subGoals.find(goal => 
    isGaining ? goal.weight > currentWeight : goal.weight < currentWeight
  );

  const lastGoal = [...subGoals].reverse().find(goal =>
    isGaining ? goal.weight <= currentWeight : goal.weight >= currentWeight
  );

  // Verificar si se alcanzó una nueva meta
  useEffect(() => {
    if (lastGoal && (!lastAchievedGoal || lastGoal.weight !== lastAchievedGoal.weight)) {
      setLastAchievedGoal(lastGoal);
      setShowCelebration(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [currentWeight, lastGoal]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Cabecera con progreso */}
      <div className="p-6 border-b border-rose-100/20 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Progreso hacia tu objetivo</h3>
              <p className="text-sm text-gray-600">
                {isGaining ? 'Ganancia' : 'Pérdida'} de peso
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-transparent bg-clip-text">
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-gray-500">completado</span>
          </div>
        </div>

        {/* Barra de progreso principal con marcadores */}
        <div className="relative mb-6">
          <div className="w-full bg-white/50 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-rose-400 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Marcadores de sub-objetivos */}
          {subGoals.map((goal, index) => {
            const goalPosition = ((Math.abs(goal.weight - initialWeight)) / totalChange) * 100;
            const isAchieved = isGaining 
              ? currentWeight >= goal.weight 
              : currentWeight <= goal.weight;

            return (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 transform"
                style={{ left: `${goalPosition}%` }}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${
                  isAchieved
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 border-white shadow-lg'
                    : 'bg-white border-gray-300'
                } transition-all duration-300`} />
              </div>
            );
          })}
        </div>

        {/* Siguiente sub-objetivo con barra de progreso */}
        {nextGoal && (
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Siguiente meta: {nextGoal.description}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isGaining ? 'Ganar' : 'Perder'} {Math.abs(nextGoal.weight - currentWeight).toFixed(1)} kg más
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-rose-500">
                  {nextGoal.weight} kg
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Barra de progreso para el sub-objetivo */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(
                    ((currentWeight - (lastGoal?.weight || initialWeight)) / 
                    (nextGoal.weight - (lastGoal?.weight || initialWeight))) * 100,
                    100
                  )}%` 
                }}
              />
            </div>
          </div>
        )}
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

        <div className="p-4 text-center relative group">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Target className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-medium text-gray-600">Objetivo</span>
          </div>
          <button
            onClick={onEditTarget}
            className="relative inline-flex items-center justify-center px-3 py-1 rounded-lg group-hover:bg-rose-50 transition-all duration-200"
            title="Editar objetivo"
          >
            <span className="text-xl font-bold text-gray-900 group-hover:text-rose-500 transition-colors">
              {targetWeight} kg
            </span>
            <div className="flex items-center ml-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="absolute inset-0 bg-rose-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
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
            weightChange === 0 ? 'text-gray-400' :
            isGaining ? 'text-red-500' : 'text-green-500'
          }`}>
            {weightChange === 0 ? '—' : 
              `${isGaining ? '+' : ''}${weightChange} kg`
            }
          </p>
        </div>
      </div>

      {/* Modal de celebración */}
      {showCelebration && lastAchievedGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center animate-bounce-slow">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <Gift className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Meta alcanzada! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Has alcanzado tu {lastAchievedGoal.description}
            </p>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl mb-6">
              <p className="font-medium text-gray-900">
                {lastAchievedGoal.weight} kg
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ¡Sigue así! 💪
              </p>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              ¡Gracias! 🌟
            </button>
          </div>
        </div>
      )}
    </div>
  );
}