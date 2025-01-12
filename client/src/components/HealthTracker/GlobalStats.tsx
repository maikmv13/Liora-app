import React, { useState } from 'react';
import { Crown, ChevronRight, Trophy, Flame, Heart, Calendar, Star, Activity, Zap } from 'lucide-react';
import { useHealth, LEVEL_TITLES, WEEK_DAYS } from '../context/HealthContext';
import { LevelsCompetition } from './WeightTracker/LevelsCompetition';
import { MonthlyCalendar } from './WeightTracker/MonthlyCalendar';

interface GlobalStatsProps {
  entries: Array<{
    date: string;
    weight?: number;
    amount?: number;
    duration?: number;
  }>;
}

export function GlobalStats({ entries }: GlobalStatsProps) {
  const [showLevels, setShowLevels] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { 
    totalXP, 
    currentStreak, 
    bestStreak, 
    lives,
    weekProgress,
    getLevel,
    getLevelProgress,
    getXPMultiplier
  } = useHealth();

  const currentLevel = getLevel();
  const levelProgress = getLevelProgress();
  const xpMultiplier = getXPMultiplier();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Panel de Nivel */}
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4 border border-violet-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 p-2 rounded-xl shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">Nivel {currentLevel + 1}</span>
                <span className="text-sm font-medium text-violet-600">{LEVEL_TITLES[currentLevel]}</span>
              </div>
              <p className="text-sm text-gray-600">{totalXP} XP total</p>
            </div>
          </div>
          <button
            onClick={() => setShowLevels(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-sm font-medium text-violet-600"
          >
            <span>Ver niveles</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="relative mb-2">
          <div className="w-full bg-white/50 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-violet-600 shadow-sm">
            {Math.round(levelProgress)}%
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="px-2 py-1 bg-amber-100 rounded-lg">
            <div className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">x{xpMultiplier} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Racha */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-4 border border-rose-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-rose-400 to-orange-500 p-2 rounded-xl shadow-md">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">{currentStreak} días</span>
                <span className="text-sm text-gray-600">en racha</span>
              </div>
              <p className="text-sm text-gray-600">Mejor: {bestStreak} días</p>
            </div>
          </div>
          <button
            onClick={() => setShowCalendar(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-sm font-medium text-rose-600"
          >
            <Calendar size={16} />
            <span>Ver calendario</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekProgress.map((completed, index) => (
            <div key={index} className="text-center">
              <div className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform ${
                completed
                  ? 'bg-gradient-to-br from-rose-400 to-orange-400 text-white shadow-lg hover:scale-105'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}>
                <span className="text-xs font-medium mb-1">{WEEK_DAYS[index]}</span>
                {completed ? (
                  <>
                    <Star className="w-4 h-4 fill-current animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md" />
                  </>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-1 mt-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Heart
              key={index}
              size={20}
              className={`transition-all duration-300 transform ${
                index < lives
                  ? 'text-rose-500 fill-rose-500 scale-110'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modales */}
      <LevelsCompetition
        isOpen={showLevels}
        onClose={() => setShowLevels(false)}
        currentLevel={currentLevel}
        totalXP={totalXP}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
      />

      <MonthlyCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        weightEntries={entries.filter(e => e.weight).map(e => ({
          date: e.date,
          weight: e.weight!
        }))}
      />
    </div>
  );
}