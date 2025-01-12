import React from 'react';
import { X, Trophy, Crown, Star, Award, Zap, Shield, Target, Flame, Gift, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelsCompetitionProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
}

const LEVEL_THRESHOLDS = [0, 300, 700, 1200, 2000, 3000, 4500, 6500, 9000, 12000];
const LEVEL_TITLES = [
  '🌱 Principiante',
  '🌿 Constante',
  '🌳 Dedicado',
  '⭐ Disciplinado',
  '🌟 Experto',
  '💫 Maestro',
  '🏆 Campeón',
  '👑 Elite',
  '⚡ Legendario',
  '🔥 Supremo'
];

const LEVEL_PERKS = [
  'Acceso a estadísticas básicas',
  'Desbloquea gráficos semanales',
  'Desbloquea análisis de tendencias',
  'Medallas personalizadas',
  'Temas exclusivos',
  'Análisis avanzado',
  'Insignias especiales',
  'Estadísticas premium',
  'Contenido exclusivo',
  'Estatus legendario'
];

const LEVEL_ICONS = [
  Shield,
  Star,
  Target,
  Award,
  Crown,
  Trophy,
  Zap,
  Flame,
  Crown,
  Trophy
];

export function LevelsCompetition({
  isOpen,
  onClose,
  currentLevel,
  totalXP,
  currentStreak,
  bestStreak
}: LevelsCompetitionProps) {
  if (!isOpen) return null;

  const calculateNextLevelProgress = () => {
    if (currentLevel === LEVEL_THRESHOLDS.length - 1) return 100;
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1];
    return ((totalXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  const nextLevelProgress = calculateNextLevelProgress();
  const xpToNextLevel = currentLevel < LEVEL_THRESHOLDS.length - 1 
    ? LEVEL_THRESHOLDS[currentLevel + 1] - totalXP 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Encabezado con nivel actual y progreso */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nivel {currentLevel + 1}</h2>
              <p className="text-sm text-gray-600 mt-1">{LEVEL_TITLES[currentLevel]}</p>
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
              <span>Progreso al siguiente nivel</span>
              <span>{Math.round(nextLevelProgress)}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${nextLevelProgress}%` }}
              />
            </div>
            {xpToNextLevel > 0 && (
              <p className="text-sm text-gray-500 text-center">
                {xpToNextLevel} XP para el siguiente nivel
              </p>
            )}
          </div>

          {/* Estadísticas del jugador */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Total XP</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{totalXP}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-gray-700">Racha</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{currentStreak} días</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
              <div className="flex items-center space-x-2 mb-1">
                <Medal className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Mejor</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{bestStreak} días</p>
            </div>
          </div>
        </div>

        {/* Lista de niveles */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-6">
            {LEVEL_TITLES.map((title, index) => {
              const Icon = LEVEL_ICONS[index];
              const isCurrentLevel = index === currentLevel;
              const isUnlocked = index <= currentLevel;
              const xpRequired = LEVEL_THRESHOLDS[index];
              const progress = index <= currentLevel ? 100 : 
                (index === currentLevel + 1 ? 
                  ((totalXP - LEVEL_THRESHOLDS[currentLevel]) / 
                   (LEVEL_THRESHOLDS[currentLevel + 1] - LEVEL_THRESHOLDS[currentLevel])) * 100 : 0);

              return (
                <div 
                  key={index}
                  className={`relative ${
                    isCurrentLevel ? 'transform scale-105 z-10' : ''
                  }`}
                >
                  {/* Línea conectora con animación */}
                  {index > 0 && (
                    <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-gray-200 to-gray-300">
                      {isUnlocked && (
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-orange-500 animate-pulse" />
                      )}
                    </div>
                  )}

                  <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCurrentLevel
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-lg'
                      : isUnlocked
                      ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}>
                    {/* Indicador de nivel actual */}
                    {isCurrentLevel && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        Nivel actual
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900">Nivel {index + 1}</h3>
                          <span className={`text-sm font-medium ${
                            isUnlocked ? 'text-emerald-500' : 'text-gray-500'
                          }`}>
                            {xpRequired} XP
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${
                          isUnlocked ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {title}
                        </p>
                        
                        {/* Ventajas del nivel */}
                        <div className={`mt-2 text-xs ${
                          isUnlocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          <div className="flex items-center space-x-1">
                            <Gift size={12} />
                            <span>{LEVEL_PERKS[index]}</span>
                          </div>
                        </div>
                        
                        {/* Barra de progreso con animación */}
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isUnlocked
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                : 'bg-gray-300'
                            } ${isCurrentLevel ? 'animate-pulse' : ''}`}
                            style={{ width: `${progress}%` }}
                          />
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
  );
}