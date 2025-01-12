import React, { useState } from 'react';
import { Heart, Flame, Calendar, Trophy, Star, Clock, ChevronDown, Award, Zap, Crown, Gift, ChevronRight } from 'lucide-react';
import { MonthlyCalendar } from './MonthlyCalendar';
import { LevelsCompetition } from './LevelsCompetition';
import { WeightEntry } from './types';

interface WeightStreakProps {
  currentStreak: number;
  lives: number;
  maxLives: number;
  weekProgress: boolean[];
  bestStreak: number;
  lastUpdate: string | null;
  weightEntries: WeightEntry[];
}

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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

export function WeightStreak({ 
  currentStreak, 
  lives, 
  maxLives,
  weekProgress,
  bestStreak,
  lastUpdate,
  weightEntries
}: WeightStreakProps) {
  const [showMonthlyStats, setShowMonthlyStats] = useState(false);
  const [showLevels, setShowLevels] = useState(false);

  // Resto del código del componente se mantiene igual...
  // (El contenido existente del componente continúa aquí)

  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
      {/* El JSX existente continúa aquí */}
    </div>
  );
}