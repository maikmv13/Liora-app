import React from 'react';
import { Trophy, Star, Target, TrendingDown, TrendingUp, Calendar, Activity, Scale, Medal, Crown, Zap, Gift, Heart, Dumbbell, Apple, Flame } from 'lucide-react';
import { CompletedGoal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
  gradient: string;
  bgPattern: string;
}

const RARITY_COLORS = {
  common: 'from-orange-400 to-rose-500',
  rare: 'from-rose-400 to-pink-500',
  epic: 'from-pink-400 to-rose-500',
  legendary: 'from-amber-400 to-orange-500'
} as const;

const PATTERNS = {
  circles: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
  plus: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M0 8h8V0h4v8h8v4h-8v8H8v-8H0V8z'/%3E%3C/g%3E%3C/svg%3E")`,
  zigzag: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`
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
        rarity: 'common',
        gradient: 'from-orange-400 to-rose-500',
        bgPattern: PATTERNS.circles
      },
      {
        id: 'consistency',
        title: 'Constancia inicial',
        description: '3 días seguidos registrando',
        icon: <Calendar className="w-6 h-6" />,
        progress: (streakDays / 3) * 100,
        achieved: streakDays >= 3,
        xp: 150,
        rarity: 'common',
        gradient: 'from-rose-400 to-pink-500',
        bgPattern: PATTERNS.plus
      },
      {
        id: 'streak',
        title: 'Racha perfecta',
        description: '7 días seguidos registrando',
        icon: <Trophy className="w-6 h-6" />,
        progress: (streakDays / 7) * 100,
        achieved: streakDays >= 7,
        xp: 300,
        rarity: 'rare',
        gradient: 'from-pink-400 to-rose-500',
        bgPattern: PATTERNS.zigzag
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
          rarity: 'epic',
          gradient: 'from-amber-400 to-orange-500',
          bgPattern: PATTERNS.diamonds
        }
      ];
    }

    const progressMilestones = [
      {
        id: 'first-goal',
        title: isGaining ? 'Primer kilo ganado' : 'Primer kilo perdido',
        description: `Has ${isGaining ? 'ganado' : 'perdido'} tu primer kilogramo`,
        icon: isGaining ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />,
        progress: Math.min((Math.abs(totalLoss) / 1) * 100, 100),
        achieved: Math.abs(totalLoss) >= 1,
        xp: 200,
        rarity: 'rare',
        gradient: 'from-rose-400 to-pink-500',
        bgPattern: PATTERNS.circles
      },
      {
        id: 'halfway',
        title: 'Medio camino',
        description: '50% del objetivo alcanzado',
        icon: <Medal className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 50,
        xp: 500,
        rarity: 'epic',
        gradient: 'from-pink-400 to-rose-500',
        bgPattern: PATTERNS.zigzag
      },
      {
        id: 'master',
        title: '¡Meta alcanzada!',
        description: 'Has llegado a tu peso objetivo',
        icon: <Crown className="w-6 h-6" />,
        progress: progress,
        achieved: progress >= 100,
        xp: 1000,
        rarity: 'legendary',
        gradient: 'from-amber-400 to-orange-500',
        bgPattern: PATTERNS.diamonds
      }
    ];

    return [...baseMilestones, ...progressMilestones];
  };

  const milestones = getMilestones();
  const achievedMilestones = milestones.filter(m => m.achieved);
  const totalXP = achievedMilestones.reduce((sum, m) => sum + m.xp, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-rose-600/80 to-pink-800/90" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Logros Desbloqueados</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-sm text-orange-200">
                    {achievedMilestones.length} de {milestones.length} completados
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                milestone.achieved ? 'bg-gradient-to-br shadow-lg' : 'bg-white/10'
              } ${milestone.achieved ? milestone.gradient : ''}`}
            >
              {/* Background Pattern */}
              {milestone.achieved && (
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: milestone.bgPattern }}
                />
              )}

              <div className="relative p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      milestone.achieved
                        ? 'bg-white/20'
                        : 'bg-white/5'
                    }`}>
                      {milestone.icon}
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        milestone.achieved ? 'text-white' : 'text-white/60'
                      }`}>
                        {milestone.title}
                      </h4>
                      <p className={`text-sm ${
                        milestone.achieved ? 'text-white/80' : 'text-white/40'
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  {milestone.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1 px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      <Gift className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-medium text-white">
                        +{milestone.xp} XP
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${milestone.progress}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        milestone.achieved
                          ? 'bg-white/30'
                          : 'bg-white/5'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs ${
                      milestone.achieved ? 'text-white/80' : 'text-white/40'
                    }`}>
                      Progreso
                    </span>
                    <span className={`text-xs font-medium ${
                      milestone.achieved ? 'text-white' : 'text-white/60'
                    }`}>
                      {Math.round(milestone.progress)}%
                    </span>
                  </div>
                </div>

                {/* Achievement Indicator */}
                {milestone.achieved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}