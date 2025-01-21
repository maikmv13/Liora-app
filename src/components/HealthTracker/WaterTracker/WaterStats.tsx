import React from 'react';
import { BarChart2, TrendingUp, Calendar, Activity } from 'lucide-react';
import type { WaterEntry } from './types';

interface WaterStatsProps {
  currentAmount: number;
  dailyGoal: number;
  entries: WaterEntry[];
}

export function WaterStats({ currentAmount, dailyGoal, entries }: WaterStatsProps) {
  // Calcular estadísticas
  const averageIntake = entries.length > 0
    ? Math.round(entries.reduce((sum, entry) => sum + entry.amount, 0) / entries.length)
    : 0;

  const bestDay = entries.reduce((best, entry) => 
    entry.amount > best.amount ? entry : best
  , { amount: 0, date: '' });

  const weeklyProgress = entries
    .slice(0, 7)
    .reduce((sum, entry) => sum + (entry.amount >= dailyGoal ? 1 : 0), 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100/20">
      <div className="p-4 border-b border-blue-100/20">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Estadísticas</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100/20">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Promedio diario</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{averageIntake}</span>
            <span className="text-sm text-gray-500 ml-1">ml</span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-gray-500">
              {Math.round((averageIntake / dailyGoal) * 100)}% del objetivo
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Mejor día</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{bestDay.amount}</span>
            <span className="text-sm text-gray-500 ml-1">ml</span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-gray-500">
              {new Date(bestDay.date).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Esta semana</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{weeklyProgress}</span>
            <span className="text-sm text-gray-500 ml-1">días</span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-gray-500">
              completando el objetivo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}