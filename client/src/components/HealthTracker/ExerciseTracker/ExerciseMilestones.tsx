import React from 'react';
import { Trophy, Star, Target, Activity, Gift, Dumbbell } from 'lucide-react';
import { ExerciseMilestone } from './types';

interface ExerciseMilestonesProps {
  totalMinutes: number;
  dailyGoal: number;
  totalDays: number;
  perfectDays: number;
  streakDays: number;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-indigo-500',
  epic: 'from-purple-400 to-pink-500',
  legendary: 'from-amber-400 to-orange-500'
};

export function ExerciseMilestones({
  totalMinutes,
  dailyGoal,
  totalDays,
  perfectDays,
  streakDays
}: ExerciseMilestonesProps) {
  const getMilestones = (): ExerciseMilestone[] => {
    const progress = (totalMinutes / dailyGoal) * 100;
    
    return [
      {
        id: 'first-workout',
        title: 'Primer entrenamiento',
        description: 'Comienza tu viaje fitness',
        xp: 100,
        rarity: 'common',
        progress: totalMinutes > 0 ? 100 : 0,
        achieved: totalMinutes > 0
      },
      {
        id: 'daily-goal',
        title: 'Objetivo diario',
        description: `${dailyGoal} minutos de ejercicio`,
        xp: 200,
        rarity: 'rare',
        progress: Math.min(progress, 100),
        achieved: totalMinutes >= dailyGoal
      },
      {
        id: 'active-week',
        title: 'Semana activa',
        description: '7 días consecutivos de ejercicio',
        xp: 500,
        rarity: 'epic',
        progress: (streakDays / 7) * 100,
        achieved: streakDays >= 7
      },
      {
        id: 'fitness-master',
        title: 'Maestro del fitness',
        description: '30 días de ejercicio constante',
        xp: 1000,
        rarity: 'legendary',
        progress: (perfectDays / 30) * 100,
        achieved: perfectDays >= 30
      }
    ];
  };

  const milestones = getMilestones();
  const achievedMilestones = milestones.filter(m => m.achieved);
  const totalXP = achievedMilestones.reduce((sum, m) => sum + m.xp, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/20">
      <div className="p-4 border-b border-emerald-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-900">Logros de ejercicio</h3>
          </div>
          <div className="text-sm font-medium text-gray-600">
            {totalXP} XP ganados
          </div>
        </div>
      </div>

      <div className="divide-y divide-emerald-100/10">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 transition-colors ${
              milestone.achieved ? 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                milestone.achieved
                  ? RARITY_COLORS[milestone.rarity]
                  : 'from-gray-100 to-gray-200'
              } ${milestone.achieved ? 'text-white' : 'text-gray-400'}`}>
                {milestone.id === 'fitness-master' ? (
                  <Star className="w-6 h-6" />
                ) : (
                  <Dumbbell className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                  {milestone.achieved && (
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-amber-100 rounded-full">
                      <Gift className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-amber-600">
                        +{milestone.xp} XP
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {milestone.description}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        milestone.achieved
                          ? `bg-gradient-to-r ${RARITY_COLORS[milestone.rarity]}`
                          : 'bg-gray-200'
                      }`}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}