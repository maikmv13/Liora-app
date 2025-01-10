import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightHistoryProps {
  entries: WeightEntry[];
  onDelete: (date: string) => void;
}

export function WeightHistory({ entries, onDelete }: WeightHistoryProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-rose-100/20 overflow-hidden">
      <div className="p-3 md:p-4 border-b border-rose-100/20">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">Historial de registros</h3>
      </div>
      <div className="divide-y divide-rose-100/10 max-h-[400px] overflow-y-auto">
        {entries.map((entry, index) => {
          const prevWeight = index < entries.length - 1 ? entries[index + 1].weight : entry.weight;
          const change = entry.weight - prevWeight;
          const isGaining = change > 0;

          return (
            <div key={entry.date} className="flex items-center justify-between p-3 md:p-4 hover:bg-rose-50/50 transition-colors">
              <div>
                <p className="text-sm md:text-base font-medium text-gray-900">{entry.weight} kg</p>
                <p className="text-xs md:text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4">
                {index < entries.length - 1 && (
                  <div className={`flex items-center space-x-1 ${
                    isGaining ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {isGaining ? (
                      <TrendingUp size={14} className="md:w-4 md:h-4" />
                    ) : (
                      <TrendingDown size={14} className="md:w-4 md:h-4" />
                    )}
                    <span className="text-xs md:text-sm font-medium">
                      {isGaining ? '+' : ''}{change.toFixed(1)} kg
                    </span>
                  </div>
                )}
                <button
                  onClick={() => onDelete(entry.date)}
                  className="text-xs md:text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}