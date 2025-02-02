import React from 'react';
import { Brain, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealth } from '../../contexts/HealthContext';
import { LEAGUES } from '../../contexts/HealthContext';

interface DashboardHeaderProps {
  onShowLevels: () => void;
}

const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(50%);
    }
  }
`;

const glowKeyframes = `
  @keyframes glow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes + glowKeyframes;
  document.head.appendChild(style);
}

export function DashboardHeader({ onShowLevels }: DashboardHeaderProps) {
  const { getLevel, totalXP } = useHealth();
  const { league, level } = getLevel();

  // Calculate total progress
  const totalXPPossible = LEAGUES[LEAGUES.length - 1].maxXP;
  const totalProgress = (totalXP / totalXPPossible) * 100;

  // Calculate XP needed for next league
  const nextLeague = LEAGUES[league + 1];
  const xpToNextLeague = nextLeague ? nextLeague.minXP - totalXP : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl rounded-b-3xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80')] bg-cover bg-top">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-indigo-600/80 to-purple-800/90" />
        
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
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Brain className="w-6 h-6 text-amber-400" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Fuerza de Voluntad
              </motion.h1>
              <div className="flex items-center mt-1 space-x-1">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span className="text-sm text-indigo-200">
                  {totalXP.toLocaleString()} puntos totales
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative">
            {/* Aura de energía (con brillo sutil) */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 via-fuchsia-300/20 to-purple-200/20 rounded-full" />
            
            {/* Barra de progreso principal */}
            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-500 to-purple-500"
                style={{ width: `${totalProgress}%` }}
              >
                {/* Patrón con movimiento continuo y lento */}
                <div 
                  className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[length:1rem_1rem]"
                  style={{
                    animation: 'shimmer 8s linear infinite',
                    backgroundSize: '24px 24px'
                  }}
                />
              </div>

              {/* Orbe de poder (con brillo suave y continuo) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${totalProgress}%` }}
              >
                <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 border-2 border-white shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {/* Brillo interno con animación continua */}
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-t from-white/0 via-white/10 to-white/20"
                    style={{
                      animation: 'glow 4s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de progreso */}
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-violet-300" />
              <span className="text-sm font-medium text-white">
                Nivel {LEAGUES[league].name}
              </span>
            </div>
            {nextLeague && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-indigo-200">
                  {xpToNextLeague.toLocaleString()} puntos para {LEAGUES[league + 1].name}
                </span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={onShowLevels}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white font-medium transition-all duration-300 group"
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Ver detalles de progreso</span>
          </div>
        </motion.button>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}