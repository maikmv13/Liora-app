import React from 'react';
import { Trophy, Star, Target, TrendingDown, TrendingUp, Calendar, Activity, Scale, Medal, Crown, Zap, Gift, Heart, Dumbbell, Apple, Flame } from 'lucide-react';
import { CompletedGoal } from './types';

interface WeightMilestonesProps {
  currentWeight: number;
  initialWeight: number;
  targetWeight: number;
  streakDays: number;
  totalLoss: number;
  completedGoals: CompletedGoal[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  achieved: boolean;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-indigo-500',
  epic: 'from-purple-400 to-pink-500',
  legendary: 'from-amber-400 to-orange-500'
};

export function WeightMilestones({
  currentWeight,
  initialWeight,
  targetWeight,
  streakDays,
  totalLoss,
  completedGoals
}: WeightMilestonesProps) {
  const isGaining = targetWeight > initialWeight;
  const isMaintaining = Math.abs(targetWeight - initialWeight) < 2;
  const totalChange = Math.abs(targetWeight - initialWeight);
  const currentChange = Math.abs(currentWeight - initialWeight);
  const progress = (currentChange / totalChange) * 100;

  const getMilestones = (): Milestone[] => {
    const baseMilestones: Milestone[] = [
      {
        id: 'first-log',
        title: 'Primer registro',
        description: '¡Has comenzado tu viaje!',
        icon: <Scale className="w-6 h-6" />,
        progress: 100,
        achieved: true,
        xp: 100,
        rarity: 'common'
      },
      {
        id: '3-day-streak',
        title: 'Constancia inicial',
        description: '3 días seguidos registrando',
        icon: <Calendar className="w-6 h-6" />,
        progress: (streakDays / 3) * 100,
        achieved: streakDays >= 3,
        xp: 150,
        rarity: 'common'
      },
      {
        id: '7-day-streak',
        title: 'Semana perfecta',
        description: '7 días seguidos registrando',
        icon: <Trophy className="w-6 h-6" />,
        progress: (streakDays / 7) * 100,
        achieved: streakDays >= 7,
        xp: 300,
        rarity: 'rare'
      },
      {
        id: '30-day-streak',
        title: 'Maestro del hábito',
        description: '30 días de registro constante',
        icon: <Crown className="w-6 h-6" />,
        progress: (streakDays / 30) * 100,
        achieved: streakDays >= 30,
        xp: 1000,
        rarity: 'legendary'
      }
    ];

    if (isMaintaining) {
      return [
        ...baseMilestones,
        {
          id: 'maintain-week',
          title: 'Equilibrio perfecto',
          description: 'Mantén tu peso por una semana',
          icon: <Activity className="w-6 h-6" />,
          progress: Math.min((streakDays / 7) * 100, 100),
          achieved: streakDays >= 7 && Math.abs(currentWeight - initialWeight) <= 2,
          xp: 500,
          rarity: 'epic'
        },
        {
          id: 'maintain-month',
          title: 'Estabilidad maestra',
          description: 'Un mes manteniendo tu peso ideal',
          icon: <Star className="w-6 h-6" />,
          progress: Math.min((streakDays / 30) * 100, 100),
          achieved: streakDays >= 30 && Math.abs(currentWeight - initialWeight) <= 2,
          xp: 1000,
          rarity: 'legendary'
        }
      ];
    }

    if (!isGaining) {
      return [
        ...baseMilestones,
        {
          id: 'first-kg-loss',
          title: 'Primer kilo perdido',
          description: 'Has perdido tu primer kilogramo',
          icon: <TrendingDown className="w-6 h-6" />,
          progress: Math.min((Math.abs(totalLoss) / 1) * 100, 100),
          achieved: Math.abs(totalLoss) >= 1,
          xp: 200,
          rarity: 'rare'
        },
        {
          id: 'healthy-pace',
          title: 'Ritmo saludable',
          description: 'Pérdida constante de 0.5-1kg por semana',
          icon: <Heart className="w-6 h-6" />,
          progress: progress,
          achieved: progress >= 25 && Math.abs(totalLoss) >= 2,
          xp: 400,
          rarity: 'epic'
        },
        {
          id: 'quarter-goal',
          title: '25% del camino',
          description: 'Has perdido un cuarto de tu objetivo',
          icon: <Flame className="w-6 h-6" />,
          progress: progress,
          achieved: progress >= 25,
          xp: 300,
          rarity: 'rare'
        },
        {
          id: 'half-way',
          title: 'Medio camino',
          description: '50% del objetivo alcanzado',
          icon: <Medal className="w-6 h-6" />,
          progress: progress,
          achieved: progress >= 50,
          xp: 500,
          rarity: 'epic'
        },
        {
          id: 'goal-achieved',
          title: '¡Meta alcanzada!',
          description: 'Has llegado a tu peso objetivo',
          icon: <Trophy className="w-6 h-6" />,
          progress: progress,
          achieved: progress >= 100,
          xp: 1000,
          rarity: 'legendary'
        }
      ];
    }

    return [
      ...baseMilestones,
      {
        id: 'first-kg-gain',
        title: 'Primer kilo ganado',
        description: 'Has ganado tu primer kilogramo',
        icon: <TrendingUp className="w-6 h-6" />,
        progress: Math.min((Math.abs(totalLoss) / 1) * 100, 100),
        achieved: Math.abs(totalLoss) >= 1,
        xp: 200,
        rarity: 'rare'
      },
      {
        id: 'muscle-builder',
        title: 'Constructor muscular',
        description: 'Ganancia constante de 0.25-0.5kg por semana',
        icon: <Dumbbell className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 25 && Math.abs(totalLoss) >= 1,
        xp: 400,
        rarity: 'epic'
      },
      {
        id: 'healthy-gain',
        title: 'Ganancia saludable',
        description: 'Aumento gradual y constante',
        icon: <Apple className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 25,
        xp: 300,
        rarity: 'rare'
      },
      {
        id: 'half-way-gain',
        title: 'Medio camino',
        description: '50% del objetivo de ganancia',
        icon: <Medal className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 50,
        xp: 500,
        rarity: 'epic'
      },
      {
        id: 'bulk-complete',
        title: '¡Volumen completado!',
        description: 'Has alcanzado tu peso objetivo',
        icon: <Crown className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 100,
        xp: 1000,
        rarity: 'legendary'
      }
    ];
  };

  const milestones = getMilestones();
  const achievedMilestones = milestones.filter(m => m.achieved);
  const totalXP = achievedMilestones.reduce((sum, m) => sum + m.xp, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
      <div className="p-4 border-b border-rose-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-gray-900">Logros</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600">
              {totalXP} XP ganados
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-rose-100/10">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 transition-colors ${
              milestone.achieved ? 'bg-gradient-to-br from-rose-50/50 to-orange-50/50' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                milestone.achieved
                  ? RARITY_COLORS[milestone.rarity]
                  : 'from-gray-100 to-gray-200'
              } ${milestone.achieved ? 'text-white' : 'text-gray-400'}`}>
                {milestone.icon}
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