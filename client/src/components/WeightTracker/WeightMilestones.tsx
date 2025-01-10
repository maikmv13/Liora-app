import React from 'react';
import { Trophy, Star, Target, TrendingDown, TrendingUp, Calendar, Activity, Scale } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  achieved?: boolean;
}

interface WeightMilestonesProps {
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  streakDays: number;
  totalLoss: number;
}

export function WeightMilestones({
  currentWeight,
  initialWeight,
  targetWeight,
  streakDays,
  totalLoss
}: WeightMilestonesProps) {
  const isGaining = targetWeight > initialWeight;
  const isMaintaining = Math.abs(targetWeight - initialWeight) < 2;
  const totalChange = Math.abs(targetWeight - initialWeight);
  const currentChange = Math.abs(currentWeight - initialWeight);
  const progress = (currentChange / totalChange) * 100;

  const getMilestones = () => {
    const baseMilestones = [
      {
        id: '7-day-streak',
        title: 'Racha de 7 días',
        description: 'Has registrado tu peso durante 7 días seguidos',
        icon: <Calendar className="text-orange-500" />,
        progress: (streakDays / 7) * 100,
        achieved: streakDays >= 7
      },
      {
        id: '30-day-streak',
        title: 'Racha de 30 días',
        description: 'Has registrado tu peso durante un mes',
        icon: <Trophy className="text-orange-500" />,
        progress: (streakDays / 30) * 100,
        achieved: streakDays >= 30
      }
    ];

    if (isMaintaining) {
      return [
        ...baseMilestones,
        {
          id: 'maintain-week',
          title: 'Semana estable',
          description: 'Has mantenido tu peso durante una semana',
          icon: <Activity className="text-orange-500" />,
          progress: Math.min((streakDays / 7) * 100, 100),
          achieved: streakDays >= 7 && Math.abs(currentWeight - initialWeight) <= 2
        },
        {
          id: 'maintain-month',
          title: 'Mes estable',
          description: 'Has mantenido tu peso durante un mes',
          icon: <Scale className="text-orange-500" />,
          progress: Math.min((streakDays / 30) * 100, 100),
          achieved: streakDays >= 30 && Math.abs(currentWeight - initialWeight) <= 2
        }
      ];
    }

    return [
      ...baseMilestones,
      {
        id: '25-progress',
        title: '25% del objetivo',
        description: '¡Has completado el primer cuarto del camino!',
        icon: <Target className="text-orange-500" />,
        progress: progress,
        achieved: progress >= 25
      },
      {
        id: '50-progress',
        title: '50% del objetivo',
        description: '¡Vas por la mitad! Mantén el ritmo',
        icon: <Star className="text-orange-500" />,
        progress: progress,
        achieved: progress >= 50
      },
      {
        id: 'first-kg',
        title: `Primer ${isGaining ? 'kg ganado' : 'kg perdido'}`,
        description: `Has ${isGaining ? 'ganado' : 'perdido'} tu primer kilogramo`,
        icon: isGaining ? <TrendingUp className="text-orange-500" /> : <TrendingDown className="text-orange-500" />,
        progress: Math.min((Math.abs(totalLoss) / 1) * 100, 100),
        achieved: Math.abs(totalLoss) >= 1
      }
    ];
  };

  const milestones = getMilestones();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-rose-100/20 overflow-hidden">
      <div className="p-3 md:p-4 border-b border-rose-100/20">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">Logros y objetivos</h3>
      </div>
      <div className="divide-y divide-rose-100/10">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-3 md:p-4 transition-colors ${
              milestone.achieved ? 'bg-gradient-to-r from-orange-50/50 to-rose-50/50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                milestone.achieved ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                {milestone.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base">
                    {milestone.title}
                  </h4>
                  {milestone.achieved && (
                    <span className="text-xs md:text-sm font-medium text-orange-500">
                      ¡Completado!
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {milestone.description}
                </p>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      milestone.achieved
                        ? 'bg-gradient-to-r from-orange-400 to-rose-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}