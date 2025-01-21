import React, { useState } from 'react';
import { GlobalStats } from './GlobalStats';
import { Activities } from './Activities';
import { LeagueProgress } from './LeagueProgress';
import { EnhancedWillpowerChart } from './EnhancedWillpowerChart';
import { LevelsCompetition } from '../WeightTracker/LevelsCompetition';
import { useHealth } from '../../../contexts/HealthContext';
import { Heart } from 'lucide-react';

export function HealthDashboard() {
  const { getLevel, totalXP } = useHealth();
  const { league, level } = getLevel();
  const [showLevels, setShowLevels] = useState(false);

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
      {/* Título principal */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-violet-100 to-indigo-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Heart className="w-6 h-6 md:w-7 md:h-7 text-violet-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de Salud</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Resumen de tu progreso y logros
          </p>
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