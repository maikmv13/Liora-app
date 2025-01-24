import React, { useState } from 'react';
import { HealthDashboard } from './HealthDashboard';
import { WeightTracker } from './WeightTracker';
import { ExerciseTracker } from './ExerciseTracker';
import { HabitTracker } from './HabitTracker';
import { HealthProvider, useHealth, LEAGUES } from './contexts/HealthContext';
import { Heart, Scale, Dumbbell, CheckSquare } from 'lucide-react';
import { useActiveMenu } from '../../hooks/useActiveMenu';

const TABS = [
  { id: 'health', label: 'Salud', icon: Heart, color: 'violet', gradient: 'from-violet-400 to-fuchsia-500' },
  { id: 'weight', label: 'Peso', icon: Scale, color: 'rose', gradient: 'from-rose-400 to-orange-500' },
  { id: 'exercise', label: 'Ejercicio', icon: Dumbbell, color: 'emerald', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'habits', label: 'Hábitos', icon: CheckSquare, color: 'amber', gradient: 'from-amber-400 to-orange-500' }
] as const;

type TabId = typeof TABS[number]['id'];

export function HealthTracker() {
  const [activeTab, setActiveTab] = useState<TabId>('health');
  const { getLevel, totalXP } = useHealth();
  const { league } = getLevel();

  // Calcular el progreso total
  const totalXPPossible = LEAGUES[LEAGUES.length - 1].maxXP;
  const totalProgress = (totalXP / totalXPPossible) * 100;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navegación */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 min-w-[120px] ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`relative z-10 flex items-center space-x-2 ${
                    isActive ? 'text-white' : `text-${tab.color}-500`
                  }`}>
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido */}
        <div className="transition-all duration-300">
          {activeTab === 'health' && <HealthDashboard />}
          {activeTab === 'weight' && <WeightTracker />}
          {activeTab === 'exercise' && <ExerciseTracker />}
          {activeTab === 'habits' && <HabitTracker />}
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;