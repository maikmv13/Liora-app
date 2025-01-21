import React from 'react';
import { X, Crown, ChevronRight, Brain, Sparkles, Zap, Flame } from 'lucide-react';
import { LEAGUES } from '../../../contexts/HealthContext';

interface LevelsCompetitionProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentLeague: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
}

export function LevelsCompetition({
  isOpen,
  onClose,
  currentLevel,
  currentLeague,
  totalXP,
  currentStreak,
  bestStreak
}: LevelsCompetitionProps) {
  if (!isOpen) return null;

  const currentLeagueInfo = LEAGUES[currentLeague];
  const currentLevelInfo = currentLeagueInfo.levels[currentLevel];
  const nextLevelInfo = currentLeagueInfo.levels[currentLevel + 1];
  
  const calculateProgress = () => {
    if (!nextLevelInfo) return 100;
    const levelXP = totalXP - currentLevelInfo.minXP;
    const levelRange = nextLevelInfo.minXP - currentLevelInfo.minXP;
    return (levelXP / levelRange) * 100;
  };

  const progress = calculateProgress();
  const xpToNextLevel = nextLevelInfo ? nextLevelInfo.minXP - totalXP : 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Encabezado con nivel actual y progreso */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${currentLeagueInfo.material} text-white text-2xl`}>
                    {currentLeagueInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                        {currentLeagueInfo.name}
                      </h2>
                      <span className="text-lg font-medium text-gray-600">
                        Nivel {currentLevel + 1}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {currentLevelInfo.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Barra de progreso del nivel actual */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-violet-500" />
                    <span>Fuerza de voluntad actual</span>
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="relative">
                  {/* Aura de energía */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-fuchsia-300/20 to-purple-200/20 rounded-full animate-pulse" />
                  
                  {/* Barra de progreso */}
                  <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Efecto de energía pulsante */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
                    </div>
                  </div>
                </div>
                {nextLevelInfo && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {nextLevelInfo.minXP - totalXP} puntos de voluntad para el siguiente nivel
                  </p>
                )}
              </div>
            </div>

            {/* Lista de niveles */}
            <div className="overflow-y-auto max-h-[60vh] p-6">
              <div className="space-y-4">
                {currentLeagueInfo.levels.map((level, index) => {
                  const isCurrentLevel = index === currentLevel;
                  const isUnlocked = index <= currentLevel;
                  const isPastLevel = index < currentLevel;

                  if (isPastLevel) {
                    return (
                      <div 
                        key={level.number}
                        className="relative transform scale-95 opacity-75 hover:opacity-100 transition-all duration-300"
                      >
                        <div className="p-3 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${currentLeagueInfo.material} text-white`}>
                              <Crown className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-sm font-medium text-gray-700">Nivel {level.number}</h3>
                                  <div className="flex items-center space-x-1">
                                    <Sparkles className="w-3 h-3 text-violet-500" />
                                    <span className="text-xs text-violet-600">{level.minXP} puntos</span>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-xs text-gray-500">{level.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={level.number}
                      className={`relative transition-all duration-300 ${
                        isCurrentLevel ? 'transform scale-105 z-10' : ''
                      }`}
                    >
                      <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        isCurrentLevel
                          ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-lg'
                          : isUnlocked
                          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                          : 'border-gray-200 bg-gray-50 opacity-50'
                      }`}>
                        {isCurrentLevel && (
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            Nivel actual
                          </div>
                        )}

                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl ${
                            isUnlocked
                              ? currentLeagueInfo.material
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-gray-900">Nivel {level.number}</h3>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3.5 h-3.5 text-violet-500" />
                                <span className={`text-sm font-medium ${
                                  isUnlocked ? 'text-violet-500' : 'text-gray-500'
                                }`}>
                                  {level.minXP} puntos
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm font-medium ${
                              isUnlocked ? 'text-gray-700' : 'text-gray-400'
                            }`}>
                              {level.title}
                            </p>
                            
                            <div className={`mt-2 space-y-1 text-xs ${
                              isUnlocked ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {level.perks.map((perk, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <Flame className="w-3 h-3 text-violet-500" />
                                  <span>{perk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie con botón de cierre */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuar mi progreso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}