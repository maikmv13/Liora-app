import React from 'react';
import { Trophy, Sparkles, Zap, ChevronRight, Brain, Flame } from 'lucide-react';
import { LEAGUES } from '../../../contexts/HealthContext';
import { LeagueBadges } from './LeagueBadges';

interface LeagueProgressProps {
  currentLeague: number;
  currentLevel: number;
  totalXP: number;
  onShowLevels: () => void;
}

export function LeagueProgress({ currentLeague, currentLevel, totalXP, onShowLevels }: LeagueProgressProps) {
  // Calcular el progreso total a través de todas las ligas
  const totalXPPossible = LEAGUES[LEAGUES.length - 1].maxXP;
  const totalProgress = (totalXP / totalXPPossible) * 100;

  // Calcular los puntos de experiencia necesarios para la siguiente liga
  const nextLeague = LEAGUES[currentLeague + 1];
  const xpToNextLeague = nextLeague ? nextLeague.minXP - totalXP : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6">
      {/* Encabezado con XP total */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Fuerza de Voluntad</h2>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <p className="text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                {totalXP.toLocaleString()} puntos de voluntad
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg">
            <div className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-medium text-violet-600">
                {Math.round(totalProgress)}% de maestría
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso mejorada con efectos de energía */}
      <div className="mb-8">
        <div className="relative">
          {/* Aura de energía */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-fuchsia-300/20 to-purple-200/20 rounded-full animate-pulse" />
          
          {/* Barra de progreso principal */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            >
              {/* Efecto de energía pulsante */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
              
              {/* Partículas de energía */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_0%,_transparent_70%)] animate-wave" />
              </div>

              {/* Destellos de energía */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-wave" style={{ animationDuration: '2s' }} />
              </div>
            </div>

            {/* Orbe de poder */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
              style={{ left: `${totalProgress}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 border-2 border-white shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Información de progreso */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-gray-600">
              Nivel {LEAGUES[currentLeague].name}
            </span>
          </div>
          {nextLeague && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {xpToNextLeague.toLocaleString()} puntos para {LEAGUES[currentLeague + 1].name}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Lista de ligas */}
      <LeagueBadges
        leagues={LEAGUES}
        currentLeague={currentLeague}
        currentLevel={currentLevel}
        totalXP={totalXP}
        onShowLevels={onShowLevels}
      />
    </div>
  );
}