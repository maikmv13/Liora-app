import React from 'react';
import { Trophy, Star, Target, Droplets, Gift, Dumbbell, Medal, Crown, Zap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseMilestonesProps {
  currentAmount: number;
  dailyGoal: number;
  totalDays: number;
  perfectDays: number;
  streakDays: number;
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
  common: 'from-emerald-400 to-green-500',
  rare: 'from-green-400 to-teal-500',
  epic: 'from-teal-400 to-emerald-500',
  legendary: 'from-lime-400 to-green-500'
} as const;

const PATTERNS = {
  circles: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
  plus: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M0 8h8V0h4v8h8v4h-8v8H8v-8H0V8z'/%3E%3C/g%3E%3C/svg%3E")`,
  zigzag: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`
};

export function ExerciseMilestones({
  currentAmount,
  dailyGoal,
  totalDays,
  perfectDays,
  streakDays
}: ExerciseMilestonesProps) {
  const getMilestones = (): Milestone[] => {
    const progress = (currentAmount / dailyGoal) * 100;
    
    return [
      {
        id: 'first-workout',
        title: 'Primer entrenamiento',
        description: 'Comienza tu viaje fitness',
        icon: <Dumbbell className="w-6 h-6" />,
        progress: currentAmount > 0 ? 100 : 0,
        achieved: currentAmount > 0,
        xp: 100,
        rarity: 'common',
        gradient: RARITY_COLORS.common,
        bgPattern: PATTERNS.circles
      },
      {
        id: 'daily-goal',
        title: 'Objetivo diario',
        description: `${dailyGoal} minutos de ejercicio`,
        icon: <Target className="w-6 h-6" />,
        progress: Math.min(progress, 100),
        achieved: progress >= 100,
        xp: 200,
        rarity: 'rare',
        gradient: RARITY_COLORS.rare,
        bgPattern: PATTERNS.plus
      },
      {
        id: 'active-week',
        title: 'Semana activa',
        description: '7 días consecutivos de ejercicio',
        icon: <Medal className="w-6 h-6" />,
        progress: (streakDays / 7) * 100,
        achieved: streakDays >= 7,
        xp: 500,
        rarity: 'epic',
        gradient: RARITY_COLORS.epic,
        bgPattern: PATTERNS.zigzag
      },
      {
        id: 'fitness-master',
        title: 'Maestro del fitness',
        description: '30 días de ejercicio constante',
        icon: <Crown className="w-6 h-6" />,
        progress: (perfectDays / 30) * 100,
        achieved: perfectDays >= 30,
        xp: 1000,
        rarity: 'legendary',
        gradient: RARITY_COLORS.legendary,
        bgPattern: PATTERNS.diamonds
      }
    ];
  };

  const milestones = getMilestones();
  const achievedMilestones = milestones.filter(m => m.achieved);
  const totalXP = achievedMilestones.reduce((sum, m) => sum + m.xp, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-800/90" />
        
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
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-white">Logros Desbloqueados</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-sm text-emerald-200">
                    {achievedMilestones.length} de {milestones.length} completados
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
              <Star className="w-4 h-4 text-emerald-300" />
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