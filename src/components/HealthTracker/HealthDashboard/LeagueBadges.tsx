import React from 'react';
import { Crown, Zap, ChevronRight } from 'lucide-react';
import { LeagueInfo } from '../contexts/HealthContext';

interface LeagueBadgesProps {
  leagues: LeagueInfo[];
  currentLeague: number;
  currentLevel: number;
  totalXP: number;
  onShowLevels: () => void;
}

const LEAGUE_INACTIVE_COLORS = {
  0: 'from-amber-50 to-orange-50', // Bronce
  1: 'from-slate-50 to-gray-50',   // Plata
  2: 'from-yellow-50 to-amber-50', // Oro
  3: 'from-emerald-50 to-teal-50', // Platino
  4: 'from-sky-50 to-cyan-50',     // Diamante
  5: 'from-fuchsia-50 to-pink-50'  // Master
};

export function LeagueBadges({ leagues, currentLeague, currentLevel, totalXP, onShowLevels }: LeagueBadgesProps) {
  const renderLeagueBadge = (league: LeagueInfo, index: number) => {
    const isCurrentLeague = index === currentLeague;
    const isUnlocked = index <= currentLeague;
    const isNextLeague = index === currentLeague + 1;
    const progress = isCurrentLeague 
      ? ((totalXP - league.minXP) / (league.maxXP - league.minXP)) * 100
      : isUnlocked ? 100 : 0;

    return (
      <div 
        key={league.name}
        className={`relative p-6 ${isCurrentLeague ? 'transform scale-105 z-10' : ''}`}
      >
        {/* Línea conectora */}
        {index > 0 && (
          <div className="absolute left-0 top-1/2 -translate-x-full h-0.5 w-6">
            <div className={`h-full rounded-full ${
              isUnlocked
                ? `${league.material} animate-pulse`
                : 'bg-gray-200'
            }`} />
          </div>
        )}

        <div className={`relative group w-28 ${
          isCurrentLeague
            ? `${league.material} shadow-lg`
            : isUnlocked
            ? 'bg-gradient-to-br from-gray-50 to-white'
            : `bg-gradient-to-br ${LEAGUE_INACTIVE_COLORS[index as keyof typeof LEAGUE_INACTIVE_COLORS]} opacity-75`
        } rounded-xl p-4 transition-all duration-300 hover:shadow-xl backdrop-blur-sm`}>
          {/* Insignia de liga actual */}
          {isCurrentLeague && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              Actual
            </div>
          )}

          {/* Icono y nombre */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 text-2xl ${
              isUnlocked
                ? `${league.material} shadow-lg transform group-hover:scale-110`
                : 'bg-gray-200'
            }`}>
              {league.icon}
            </div>
            <h3 className={`text-sm font-bold truncate w-full text-center mb-1 ${
              isCurrentLeague ? 'text-white' : 'text-gray-900'
            }`}>
              {league.name}
            </h3>

            {/* Nivel o requisito */}
            {isCurrentLeague ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowLevels();
                }}
                className="relative z-10 flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Crown className="w-3 h-3 text-white/80" />
                <span className="text-xs text-white/80">Nivel {currentLevel + 1}</span>
                <ChevronRight className="w-3 h-3 text-white/60" />
              </button>
            ) : isNextLeague ? (
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{league.minXP}XP</span>
              </div>
            ) : null}
          </div>

          {/* Barra de progreso */}
          {(isCurrentLeague || isNextLeague) && (
            <div className="mt-2">
              <div className="w-full bg-black/10 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isUnlocked
                      ? 'bg-white/30 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {isCurrentLeague && (
                <div className="flex justify-between text-[8px] mt-0.5">
                  <span className="text-white/80">{league.minXP}</span>
                  <span className="text-white/80">{league.maxXP}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between space-x-12 overflow-x-auto pb-4 scrollbar-hide">
      {leagues.map((league, index) => renderLeagueBadge(league, index))}
    </div>
  );
}