import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Trophy, Target, Calendar } from 'lucide-react';
import { WaterMilestones } from './WaterTracker/WaterMilestones';
import { WaterEntry } from './WaterTracker/types';
import { useHealth } from '../../../contexts/HealthContext';

interface WaterTrackerProps {
  onXPGain: (xp: number) => void;
}

export function WaterTracker({ onXPGain }: WaterTrackerProps) {
  const { updateStreak } = useHealth();
  const [dailyGoal] = useState(2000); // ml
  const [currentAmount, setCurrentAmount] = useState(0);
  const [entries, setEntries] = useState<WaterEntry[]>(() => {
    const saved = localStorage.getItem('waterEntries');
    return saved ? JSON.parse(saved) : [];
  });

  // Cargar el registro de hoy si existe
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(entry => entry.date.startsWith(today));
    if (todayEntry) {
      setCurrentAmount(todayEntry.amount);
    } else {
      setCurrentAmount(0);
    }
  }, []);

  // Guardar entradas en localStorage
  useEffect(() => {
    localStorage.setItem('waterEntries', JSON.stringify(entries));
  }, [entries]);

  const addWater = (amount: number) => {
    const newAmount = Math.max(0, currentAmount + amount);
    setCurrentAmount(newAmount);
    
    const today = new Date().toISOString();
    const todayDate = today.split('T')[0];
    
    // Actualizar o crear entrada para hoy
    const updatedEntries = entries.filter(entry => !entry.date.startsWith(todayDate));
    const newEntry: WaterEntry = {
      date: today,
      amount: newAmount
    };
    setEntries([newEntry, ...updatedEntries]);

    // Otorgar XP por diferentes hitos
    if (currentAmount === 0 && newAmount > 0) {
      onXPGain(50); // Primera hidratación del día
    }
    
    if (currentAmount < dailyGoal/2 && newAmount >= dailyGoal/2) {
      onXPGain(100); // Alcanzar 50% del objetivo
    }
    
    if (currentAmount < dailyGoal && newAmount >= dailyGoal) {
      onXPGain(200); // Completar objetivo diario
    }

    updateStreak(today, 'water');
  };

  const progress = (currentAmount / dailyGoal) * 100;

  // Calcular estadísticas
  const perfectDays = entries.filter(entry => entry.amount >= dailyGoal).length;
  const streakDays = entries.reduce((streak, entry) => {
    return entry.amount >= dailyGoal ? streak + 1 : 0;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Panel principal */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hidratación Diaria</h3>
              <p className="text-sm text-gray-600">
                Objetivo: {dailyGoal}ml
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-500">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="relative h-8 bg-white rounded-full overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.15)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.15)_50%,_rgba(255,255,255,0.15)_75%,_transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_1s_infinite_linear]"></div>
          </div>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => addWater(-250)}
            className="p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-6 h-6 text-blue-500 mx-auto" />
            <span className="text-sm text-gray-600 mt-1">-250ml</span>
          </button>
          <div className="p-3 bg-white rounded-xl text-center">
            <span className="text-xl font-bold text-gray-900">{currentAmount}</span>
            <span className="text-sm text-gray-600 block">ml</span>
          </div>
          <button
            onClick={() => addWater(250)}
            className="p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-blue-500 mx-auto" />
            <span className="text-sm text-gray-600 mt-1">+250ml</span>
          </button>
        </div>
      </div>

      {/* Logros */}
      <WaterMilestones
        currentAmount={currentAmount}
        dailyGoal={dailyGoal}
        totalDays={entries.length}
        perfectDays={perfectDays}
        streakDays={streakDays}
      />
    </div>
  );
}