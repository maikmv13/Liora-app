import React, { useState } from 'react';
import { GlobalStats } from './GlobalStats';
import { Activities } from './Activities';
import { LeagueProgress } from './LeagueProgress';
import { EnhancedWillpowerChart } from './EnhancedWillpowerChart';
import { LevelsCompetition } from '../WeightTracker/LevelsCompetition';
import { useHealth } from '../contexts/HealthContext';
import { Brain, Sparkles, Flame } from 'lucide-react';
import { LEAGUES } from '../contexts/HealthContext';

export function HealthDashboard() {
  const { getLevel, totalXP } = useHealth();
  const { league, level } = getLevel();
  const [showLevels, setShowLevels] = useState(false);

  // Calcular el progreso total
  const totalXPPossible = LEAGUES[LEAGUES.length - 1].maxXP;
  const totalProgress = (totalXP / totalXPPossible) * 100;

  // Recolectar todas las entradas para las estadísticas globales
  const getAllEntries = () => {
    const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const waterEntries = JSON.parse(localStorage.getItem('waterEntries') || '[]');
    const exerciseEntries = JSON.parse(localStorage.getItem('exerciseEntries') || '[]');

    return [...weightEntries, ...waterEntries, ...exerciseEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <div className="space-y-6">
        {/* Header con progreso */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-rose-100/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          {/* Título y XP */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg shadow-sm">
                <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Fuerza de Voluntad</h1>
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <p className="text-xs font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                    {totalXP.toLocaleString()} puntos
                  </p>
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg">
              <div className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-xs font-medium text-violet-600">
                  {Math.round(totalProgress)}% maestría
                </span>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500 transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de ligas */}
      <LeagueProgress
        currentLeague={league}
        currentLevel={level}
        totalXP={totalXP}
        onShowLevels={() => setShowLevels(true)}
      />

      {/* Estadísticas globales y gráfico semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlobalStats entries={getAllEntries()} />
        <EnhancedWillpowerChart />
      </div>

      {/* Historial de actividades */}
      <Activities entries={getAllEntries()} />

      {/* Modal de niveles */}
      <LevelsCompetition
        isOpen={showLevels}
        onClose={() => setShowLevels(false)}
        currentLevel={level}
        currentLeague={league}
        totalXP={totalXP}
        currentStreak={7}
        bestStreak={14}
      />
    </div>
  );
}