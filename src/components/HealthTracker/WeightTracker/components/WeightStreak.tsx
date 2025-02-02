import React from 'react';
import { Heart, Flame, Calendar, Trophy, Star, Clock } from 'lucide-react';
import { MonthlyCalendar } from './MonthlyCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeightEntry } from '../types';
import { WEEK_DAYS } from '../../contexts/HealthContext';

interface WeightStreakProps {
  currentStreak: number;
  lives: number;
  maxLives: number;
  weekProgress: boolean[];
  bestStreak: number;
  lastUpdate: string | null;
  weightEntries: WeightEntry[];
}

export function WeightStreak({
  currentStreak,
  lives,
  maxLives,
  weekProgress,
  bestStreak,
  lastUpdate,
  weightEntries
}: WeightStreakProps) {
  const [showCalendar, setShowCalendar] = React.useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Header con racha y vidas */}
      <div className="relative p-6 bg-gradient-to-br from-violet-600 to-indigo-700">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Vidas en la esquina superior derecha */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <div className="flex items-center space-x-2">
              {Array.from({ length: maxLives }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: index < lives ? 1 : 0.8,
                    opacity: index < lives ? 1 : 0.3
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      index < lives ? 'text-rose-400' : 'text-gray-400'
                    }`}
                    fill={index < lives ? 'currentColor' : 'none'}
                  />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-white/80">Vidas restantes</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Racha actual</h3>
              <div className="flex items-center mt-1 space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-xs text-indigo-200">
                  {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'Sin registros'}
                </span>
              </div>
            </div>
          </div>

          {/* Contador grande */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                {currentStreak}
              </span>
              <div className="absolute -right-2 -top-2">
                <div className="relative">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <div className="absolute inset-0 animate-ping">
                    <Star className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-indigo-200 mt-1">días seguidos</span>
          </div>

          {/* Mejor racha */}
          <div className="mt-4 flex items-center justify-center space-x-2 bg-white/10 rounded-lg py-2 backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-indigo-100">Mejor racha: {bestStreak} días</span>
          </div>
        </div>
      </div>

      {/* Progreso semanal */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              <span className="font-medium text-gray-900">Esta semana</span>
            </div>
            {weekProgress.every(day => day) && (
              <div className="px-2 py-1 bg-violet-100 rounded-lg">
                <span className="text-xs text-violet-600 font-medium">¡Semana perfecta!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekProgress.map((completed, index) => (
              <div key={index} className="text-center">
                <motion.div 
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
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
                    <>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-lg"
                      />
                    </>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Botón de calendario */}
          <button
            onClick={() => setShowCalendar(true)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors text-violet-600"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Ver calendario completo</span>
          </button>
        </div>
      </div>

      {/* Modal del calendario */}
      <AnimatePresence>
        {showCalendar && (
          <MonthlyCalendar
            isOpen={showCalendar}
            onClose={() => setShowCalendar(false)}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            weightEntries={weightEntries}
          />
        )}
      </AnimatePresence>
    </div>
  );
}