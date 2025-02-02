import React from 'react';
import { Heart, Calendar, Star, Clock, Flame, Trophy } from 'lucide-react';
import { useHealth, WEEK_DAYS } from '../../contexts/HealthContext';
import { LevelsCompetition } from '../../WeightTracker/LevelsCompetition';
import { MonthlyCalendar } from '../../WeightTracker/MonthlyCalendar';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalStatsProps {
  entries: Array<{
    date: string;
    weight?: number;
    amount?: number;
    duration?: number;
  }>;
}

export function GlobalStats({ entries }: GlobalStatsProps) {
  const [showLevels, setShowLevels] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  
  const { 
    totalXP, 
    currentStreak, 
    bestStreak, 
    lives,
    weekProgress,
    getLevel,
    lastUpdate
  } = useHealth();

  const { league, level } = getLevel();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Header with gradient */}
      <div className="relative p-4 bg-gradient-to-br from-violet-600 to-indigo-700">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Racha actual</h3>
                <div className="flex items-center mt-0.5 space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs text-indigo-200">
                    {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'Sin registros'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Streak counter with "días" text */}
            <div className="text-center">
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  {currentStreak}
                </span>
                <span className="text-2xl font-bold text-amber-300">
                  {currentStreak === 1 ? 'día' : 'días'}
                </span>
              </div>
            </div>
          </div>

          {/* Best streak badge */}
          <div className="mt-2 flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-indigo-100">Mejor racha: {bestStreak} días</span>
          </div>
        </div>
      </div>

      {/* Weekly progress with lives */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              <span className="font-medium text-gray-900">Esta semana</span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Lives display */}
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: index < lives ? 1 : 0.8,
                      opacity: index < lives ? 1 : 0.3
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      animate={index < lives ? {
                        scale: [1, 1.1, 1],
                        transition: { 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.2
                        }
                      } : {}}
                    >
                      <Heart 
                        className={`w-6 h-6 ${
                          index < lives ? 'text-rose-400' : 'text-gray-300'
                        }`}
                        fill={index < lives ? 'currentColor' : 'none'}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              {weekProgress.every(day => day) && (
                <div className="px-2 py-1 bg-violet-100 rounded-lg">
                  <span className="text-xs text-violet-600 font-medium">¡Semana perfecta!</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekProgress.map((completed, index) => (
              <div key={index} className="text-center">
                <motion.div 
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                    completed
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                      : 'bg-white border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`text-xs font-medium mb-1 ${
                    completed ? 'text-violet-100' : 'text-gray-500'
                  }`}>
                    {WEEK_DAYS[index]}
                  </span>
                  {completed ? (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="relative"
                    >
                      <Flame className="w-4 h-4 text-amber-400" />
                      <motion.div
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity
                        }}
                        className="absolute inset-0 blur-sm"
                      >
                        <Flame className="w-4 h-4 text-amber-300" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCalendar(true)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors text-violet-600"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Ver calendario completo</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <LevelsCompetition
        isOpen={showLevels}
        onClose={() => setShowLevels(false)}
        currentLevel={level}
        currentLeague={league}
        totalXP={totalXP}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
      />

      <MonthlyCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        weightEntries={entries.filter(e => e.weight).map(e => ({
          date: e.date,
          weight: e.weight!
        }))}
      />
    </div>
  );
}