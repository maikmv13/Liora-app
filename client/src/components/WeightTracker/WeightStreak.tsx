import React from 'react';
import { Heart, Flame, Calendar, Trophy, Star } from 'lucide-react';

interface WeightStreakProps {
  currentStreak: number;
  lives: number;
  maxLives: number;
  weekProgress: boolean[];
  bestStreak: number;
  lastUpdate: string | null;
}

export function WeightStreak({ 
  currentStreak, 
  lives, 
  maxLives,
  weekProgress,
  bestStreak,
  lastUpdate
}: WeightStreakProps) {
  const getTimeRemaining = () => {
    if (!lastUpdate) return null;
    
    const lastUpdateDate = new Date(lastUpdate);
    const now = new Date();
    const nextDay = new Date(lastUpdateDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(23, 59, 59, 999);
    
    const timeRemaining = nextDay.getTime() - now.getTime();
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-100 overflow-hidden shadow-sm">
      {/* Cabecera con racha actual */}
      <div className="p-4 border-b border-rose-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Flame className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{currentStreak}</span>
                <span className="text-gray-600">días en racha</span>
              </div>
              <p className="text-sm text-gray-500">¡Mantén el ritmo!</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxLives }).map((_, index) => (
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
      </div>

      {/* Progreso semanal */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekProgress.map((completed, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ${
                completed
                  ? 'bg-white shadow-sm text-rose-500'
                  : 'bg-white/50 text-gray-400'
              }`}
            >
              {completed ? (
                <Star className="w-4 h-4 fill-current" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-600">Mejor racha</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{bestStreak} días</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-600">Siguiente</span>
            </div>
            {timeRemaining ? (
              <p className="text-sm font-medium text-gray-900">
                {timeRemaining.hours}h {timeRemaining.minutes}m
              </p>
            ) : (
              <p className="text-sm font-medium text-rose-500">¡Registra hoy!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}