import React, { useState, useEffect } from 'react';
import { Scale, Target, TrendingDown, TrendingUp, Activity, Trophy, Gift, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="relative p-6 bg-gradient-to-br from-rose-50 to-orange-50">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
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

          {/* Barra de progreso mejorada */}
          <div className="relative mb-6">
            {/* Fondo de la barra */}
            <div className="absolute inset-0 bg-gray-100 rounded-full" />
            
            {/* Barra de progreso */}
            <div className="relative h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
              </div>
            </div>

            {/* Marcadores de peso */}
            <div className="absolute -top-8 left-0 w-full flex justify-between text-sm">
              {/* Peso inicial */}
              <div className="flex flex-col items-center">
                <span className="font-medium text-gray-900">{initialWeight} kg</span>
                <span className="text-xs text-gray-500">Inicial</span>
              </div>

              {/* Peso actual */}
              <div 
                className="absolute flex flex-col items-center"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              >
                <div className="bg-white px-2 py-1 rounded-lg shadow-lg border border-rose-200">
                  <span className="font-bold text-rose-500">{currentWeight} kg</span>
                </div>
                <div className="w-0.5 h-2 bg-rose-500 mt-1" />
              </div>

              {/* Peso objetivo */}
              <div className="flex flex-col items-center">
                <span className="font-medium text-gray-900">{targetWeight} kg</span>
                <span className="text-xs text-gray-500">Objetivo</span>
              </div>
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
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${goalPosition}%` }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-2 h-2 rounded-full border ${
                      isAchieved
                        ? 'bg-amber-400 border-white'
                        : 'bg-white border-gray-300'
                    } shadow-sm`}
                  />
                  {isAchieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full shadow-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Siguiente sub-objetivo */}
          {nextGoal && (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
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
            </div>
          )}
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
      <AnimatePresence>
        {showCelebration && lastAchievedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full text-center"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}