import React from 'react';
import { X, Calendar, Trophy, Flame } from 'lucide-react';
import { WaterStats } from './WaterStats';
import type { WaterEntry } from './types';

interface WaterHistoryProps {
  entries: WaterEntry[];
  dailyGoal: number;
  onClose: () => void;
}

export function WaterHistory({ entries, dailyGoal, onClose }: WaterHistoryProps) {
  // Calcular estadísticas
  const perfectDays = entries.filter(entry => entry.amount >= dailyGoal).length;
  const currentStreak = entries.reduce((streak, entry) => {
    return entry.amount >= dailyGoal ? streak + 1 : 0;
  }, 0);
  const bestStreak = entries.reduce((best, entry) => {
    const streak = entries.filter(e => e.amount >= dailyGoal).length;
    return Math.max(best, streak);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Historial de Hidratación</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{entries.length}d</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Flame className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Racha</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{currentStreak}d</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Mejor</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{perfectDays}d</p>
          </div>
        </div>

        {/* Historial */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {entries.map((entry, index) => (
            <div
              key={entry.date}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  entry.amount >= dailyGoal ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className="text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
              <span className={`font-medium ${
                entry.amount >= dailyGoal ? 'text-green-500' : 'text-gray-500'
              }`}>
                {entry.amount} ml
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}