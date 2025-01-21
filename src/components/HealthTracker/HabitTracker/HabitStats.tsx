import React from 'react';
import { BarChart, Calendar, TrendingUp, Activity } from 'lucide-react';
import type { DailyEntry } from './types';

interface HabitStatsProps {
  entries: DailyEntry[];
}

export function HabitStats({ entries }: HabitStatsProps) {
  // Calcular estadísticas
  const totalHabits = entries.reduce((sum, entry) => sum + entry.habits.length, 0);
  const completedHabits = entries.reduce(
    (sum, entry) => sum + entry.habits.filter(h => h.isCompleted).length,
    0
  );
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100)
    : 0;

  // Analizar estados de ánimo
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood.mood] = (acc[entry.mood.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const MOOD_LABELS = {
    veryBad: 'Muy mal',
    bad: 'Mal',
    neutral: 'Normal',
    good: 'Bien',
    veryGood: 'Muy bien'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Tasa de completado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600">Tasa de completado</h4>
            <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-emerald-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Total de hábitos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600">Total de hábitos</h4>
            <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
          </div>
        </div>
      </div>

      {/* Días registrados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Calendar className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600">Días registrados</h4>
            <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
          </div>
        </div>
      </div>

      {/* Estado de ánimo dominante */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600">Estado dominante</h4>
            <p className="text-2xl font-bold text-gray-900">
              {dominantMood ? MOOD_LABELS[dominantMood as keyof typeof MOOD_LABELS] : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}