import React from 'react';
import { X, Crown, ChevronRight, Brain, Sparkles, Zap, Flame } from 'lucide-react';
import { LEAGUES } from '../../contexts/HealthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelsCompetitionProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentLeague: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
}

// Define background images for each league
const LEAGUE_BACKGROUNDS = {
  'Explorador Terrestre': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'Piloto Espacial': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  'Navegante Lunar': 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe',
  'Pionero Planetario': 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700',
  'Capitán Estelar': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
  'Comandante Galáctico': 'https://images.unsplash.com/photo-1465101162946-4377e57745c3',
  'Guardián Cósmico': 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45',
  'Almirante Astral': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a',
  'Maestro del Universo': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7',
  'Leyenda Intergaláctica': 'https://images.unsplash.com/photo-1462332420958-a05d1e002413'
};

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header con gradiente y fondo específico */}
            <div className="relative overflow-hidden">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${LEAGUE_BACKGROUNDS[currentLeagueInfo.name]})` }}
              >
                <div className={`absolute inset-0 ${currentLeagueInfo.material} opacity-90`} />
                
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl ${currentLeagueInfo.material} text-white text-2xl`}>
                      {currentLeagueInfo.icon}
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text">
                          {currentLeagueInfo.name}
                        </h2>
                        <span className="text-lg font-medium text-white/90">
                          Nivel {currentLevel + 1}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-white/90 mt-1">
                        {currentLevelInfo.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/90 mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-violet-300" />
                      <span>Fuerza de voluntad actual</span>
                    </div>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="relative">
                    {/* Aura de energía */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-fuchsia-300/20 to-purple-200/20 rounded-full animate-pulse" />
                    
                    {/* Barra de progreso */}
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      >
                        {/* Efecto de energía pulsante */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
                      </div>
                    </div>
                  </div>
                  {nextLevelInfo && (
                    <p className="text-sm text-white/80 text-center mt-2">
                      {nextLevelInfo.minXP - totalXP} puntos de voluntad para el siguiente nivel
                    </p>
                  )}
                </div>

                {/* Stats rápidos */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Total XP</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">{totalXP}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Racha</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">{currentStreak}d</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Mejor</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">{bestStreak}d</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de niveles con fondos específicos */}
            <div className="overflow-y-auto max-h-[60vh] p-6">
              <div className="space-y-4">
                {currentLeagueInfo.levels.map((level, index) => {
                  const isCurrentLevel = index === currentLevel;
                  const isUnlocked = index <= currentLevel;
                  const isPastLevel = index < currentLevel;

                  return (
                    <motion.div 
                      key={level.number}
                      className={`relative transition-all duration-300 ${
                        isCurrentLevel ? 'transform scale-105 z-10' : ''
                      }`}
                    >
                      <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        isCurrentLevel
                          ? 'border-violet-500 shadow-lg'
                          : isUnlocked
                          ? 'border-emerald-200'
                          : 'border-gray-200 opacity-50'
                      }`}>
                        {/* Level-specific background */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                          style={{ 
                            backgroundImage: `url(${LEAGUE_BACKGROUNDS[currentLeagueInfo.name]})`,
                            opacity: isCurrentLevel ? 0.1 : 0.05
                          }}
                        />

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
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-violet-50 to-fuchsia-50">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continuar mi progreso
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}