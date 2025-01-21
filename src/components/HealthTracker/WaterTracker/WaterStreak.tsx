import React from 'react';
import { Flame, Trophy, Calendar, Star } from 'lucide-react';
import type { WaterEntry } from './types';

interface WaterStreakProps {
  currentStreak: number;
  bestStreak: number;
  entries: WaterEntry[];
  dailyGoal: number;
}

export function WaterStreak({
  currentStreak,
  bestStreak,
  entries,
  dailyGoal
}: WaterStreakProps) {
  // Obtener los últimos 7 días
  const weekProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const entry = entries.find(e => e.date.startsWith(dateStr));
    return entry ? entry.amount >= dailyGoal : false;
  }).reverse();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 overflow-hidden">
      <div className="p-4 border-b border-blue-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Racha actual</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600">
              Mejor: {bestStreak} días
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500">{currentStreak}</div>
            <div className="text-sm text-gray-600">días seguidos</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekProgress.map((completed, index) => (
            <div key={index} className="text-center">
              <div className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-300 transform ${
                completed
                  ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg hover:scale-105'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}>
                <span className="text-xs font-medium mb-1">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                </span>
                {completed ? (
                  <>
                    <Star className="w-4 h-4 fill-current animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-md" />
                  </>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}