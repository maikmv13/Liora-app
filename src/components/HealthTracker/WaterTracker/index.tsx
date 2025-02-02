import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Settings, Calendar } from 'lucide-react';
import { WaterGoalModal } from './WaterGoalModal';
import { WaterHistory } from './WaterHistory';
import { useHealth } from '../contexts/HealthContext';
import type { WaterEntry } from './types';
import confetti from 'canvas-confetti';

export function WaterTracker() {
  const { addXP, updateStreak } = useHealth();
  const [currentAmount, setCurrentAmount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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
    
    const updatedEntries = entries.filter(entry => !entry.date.startsWith(todayDate));
    const newEntry: WaterEntry = {
      date: today,
      amount: newAmount
    };
    setEntries([newEntry, ...updatedEntries]);

    if (currentAmount === 0 && newAmount > 0) {
      addXP(25);
    }
    
    if (currentAmount < dailyGoal/2 && newAmount >= dailyGoal/2) {
      addXP(50);
    }
    
    if (currentAmount < dailyGoal && newAmount >= dailyGoal) {
      addXP(100);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    updateStreak(today, 'water');
  };

  const handleUpdateGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    setShowGoalModal(false);
    addXP(50);
  };

  const progress = (currentAmount / dailyGoal) * 100;

  return (
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
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.15)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.15)_50%,_rgba(255,255,255,0.15)_75%,_transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_2s_infinite_linear]"></div>
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

      {/* Modales */}
      {showGoalModal && (
        <WaterGoalModal
          currentGoal={dailyGoal}
          onClose={() => setShowGoalModal(false)}
          onUpdateGoal={handleUpdateGoal}
        />
      )}
      {showHistory && (
        <WaterHistory
          entries={entries}
          dailyGoal={dailyGoal}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}