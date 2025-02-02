import React from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { GlobalStats } from './components/GlobalStats';
import { Activities } from './components/Activities';
import { LeagueProgress } from './components/LeagueProgress';
import { EnhancedWillpowerChart } from './components/EnhancedWillpowerChart';
import { LeagueBadges } from './components/LeagueBadges';
import { LevelsCompetition } from '../WeightTracker/LevelsCompetition';
import { useHealth } from '../contexts/HealthContext';
import { LEAGUES } from '../contexts/HealthContext';

export function HealthDashboard() {
  const { getLevel, totalXP } = useHealth();
  const { league, level } = getLevel();
  const [showLevels, setShowLevels] = React.useState(false);

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
      <DashboardHeader onShowLevels={() => setShowLevels(true)} />

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