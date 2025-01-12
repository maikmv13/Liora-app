import React from 'react';
import { Activity, Scale, Droplets, Dumbbell, Calendar, Trophy, Target } from 'lucide-react';

interface ActivitiesProps {
  entries: Array<{
    date: string;
    weight?: number;
    amount?: number;
    duration?: number;
  }>;
}

export function Activities({ entries }: ActivitiesProps) {
  // Estadísticas globales
  const totalWeightEntries = entries.filter(e => e.weight).length;
  const totalWaterEntries = entries.filter(e => e.amount).length;
  const totalExerciseEntries = entries.filter(e => e.duration).length;

  // Agrupar entradas por fecha
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="space-y-6">
      {/* Panel de resumen */}
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6 border border-violet-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 p-2.5 rounded-xl shadow-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Resumen de actividades</h3>
            <p className="text-sm text-gray-600">
              Total de registros: {entries.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center justify-center mb-3">
              <Scale className="w-8 h-8 text-rose-500" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{totalWeightEntries}</span>
              <span className="text-sm text-gray-600">Registros de peso</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center justify-center mb-3">
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{totalWaterEntries}</span>
              <span className="text-sm text-gray-600">Registros de agua</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center justify-center mb-3">
              <Dumbbell className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{totalExerciseEntries}</span>
              <span className="text-sm text-gray-600">Ejercicios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de actividades */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100">
        <div className="p-4 border-b border-violet-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-violet-500" />
            <h3 className="font-semibold text-gray-900">Historial de actividades</h3>
          </div>
        </div>

        <div className="divide-y divide-violet-100">
          {Object.entries(groupedEntries).map(([date, dayEntries]) => (
            <div key={date} className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">{date}</h4>
              <div className="space-y-3">
                {dayEntries.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {entry.weight && (
                      <div className="flex items-center space-x-2 bg-rose-50 px-3 py-2 rounded-lg">
                        <Scale className="w-4 h-4 text-rose-500" />
                        <span className="text-sm font-medium text-rose-600">
                          {entry.weight} kg
                        </span>
                      </div>
                    )}
                    {entry.amount && (
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">
                          {entry.amount} ml
                        </span>
                      </div>
                    )}
                    {entry.duration && (
                      <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
                        <Dumbbell className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">
                          {entry.duration} min
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}