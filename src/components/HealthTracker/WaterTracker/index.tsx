import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Calendar, Settings } from 'lucide-react';
import { WaterMilestones } from './WaterMilestones';
import { WaterStats } from './WaterStats';
import { WaterHistory } from './WaterHistory';
import { WaterStreak } from './WaterStreak';
import { WaterGoalModal } from './WaterGoalModal';
import { useHealth } from '../../../contexts/HealthContext';
import type { WaterEntry } from './types';
import confetti from 'canvas-confetti';

export function WaterTracker() {
  const { addXP, updateStreak } = useHealth();
  const [currentAmount, setCurrentAmount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [showHistory, setShowHistory] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [entries, setEntries] = useState<WaterEntry[]>(() => {
    const saved = localStorage.getItem('waterEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('waterEntries', JSON.stringify(entries));
  }, [entries]);

  const addWater = (amount: number) => {
    const newAmount = Math.max(0, currentAmount + amount);
    setCurrentAmount(newAmount);
    
    const today = new Date().toISOString();
    const todayDate = today.split('T')[0];
    
    // Update or create entry for today
    const updatedEntries = entries.filter(entry => !entry.date.startsWith(todayDate));
    const newEntry: WaterEntry = {
      date: today,
      amount: newAmount
    };
    setEntries([newEntry, ...updatedEntries]);

    // Award XP based on progress
    if (currentAmount === 0 && newAmount > 0) {
      addXP(25); // First hydration of the day
    }
    
    if (currentAmount < dailyGoal/2 && newAmount >= dailyGoal/2) {
      addXP(50); // Reaching 50% of daily goal
    }
    
    if (currentAmount < dailyGoal && newAmount >= dailyGoal) {
      addXP(100); // Completing daily goal
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Only add willpower points, no streak update for water
    updateStreak(today, 'water');
  };

  const handleUpdateGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    setShowGoalModal(false);
    addXP(50); // Bonus XP for setting a goal
  };

  const progress = (currentAmount / dailyGoal) * 100;

  // Calculate streaks
  const currentStreak = entries.reduce((streak, entry) => {
    const amount = entry.amount;
    return amount >= dailyGoal ? streak + 1 : 0;
  }, 0);

  const bestStreak = entries.reduce((best, entry) => {
    const streak = entries.filter(e => e.amount >= dailyGoal).length;
    return Math.max(best, streak);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Droplets className="w-6 h-6 md:w-7 md:h-7 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Hidratación</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Control de ingesta de agua
          </p>
        </div>
      </div>

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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setShowGoalModal(true)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
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
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {currentAmount} / {dailyGoal} ml
            </span>
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

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel izquierdo */}
        <div className="lg:col-span-8 space-y-6">
          {/* Estadísticas */}
          <WaterStats
            currentAmount={currentAmount}
            dailyGoal={dailyGoal}
            entries={entries}
          />

          {/* Logros */}
          <WaterMilestones
            currentAmount={currentAmount}
            dailyGoal={dailyGoal}
            totalDays={entries.length}
            perfectDays={entries.filter(e => e.amount >= dailyGoal).length}
            streakDays={currentStreak}
          />
        </div>

        {/* Panel derecho */}
        <div className="lg:col-span-4">
          <WaterStreak
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            entries={entries}
            dailyGoal={dailyGoal}
          />
        </div>
      </div>

      {/* Modales */}
      {showHistory && (
        <WaterHistory
          entries={entries}
          dailyGoal={dailyGoal}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showGoalModal && (
        <WaterGoalModal
          currentGoal={dailyGoal}
          onClose={() => setShowGoalModal(false)}
          onUpdateGoal={handleUpdateGoal}
        />
      )}
    </div>
  );
}