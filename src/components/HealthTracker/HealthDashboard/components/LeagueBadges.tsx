import React, { useState, useRef } from 'react';
import { Crown, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { LeagueInfo } from '../../contexts/HealthContext';
import { motion } from 'framer-motion';

interface LeagueBadgesProps {
  leagues: LeagueInfo[];
  currentLeague: number;
  currentLevel: number;
  totalXP: number;
  onShowLevels: () => void;
}

export function LeagueBadges({ leagues, currentLeague, currentLevel, totalXP, onShowLevels }: LeagueBadgesProps) {
  const [currentIndex, setCurrentIndex] = useState(currentLeague);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'next' && currentIndex < leagues.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const renderLeagueBadge = (league: LeagueInfo, index: number) => {
    const isCurrentLeague = index === currentLeague;
    const isUnlocked = index <= currentLeague;
    const progress = isCurrentLeague 
      ? ((totalXP - league.minXP) / (league.maxXP - league.minXP)) * 100
      : isUnlocked ? 100 : 0;

    return (
      <motion.div 
        key={league.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: index === currentIndex ? 1 : 0.8,
          opacity: index === currentIndex ? 1 : 0.6,
        }}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 w-full px-4 ${
          index === currentIndex ? 'transform scale-105 z-10' : ''
        }`}
      >
        {/* Badge Container */}
        <div className={`relative overflow-hidden rounded-2xl ${league.material} p-6 transition-all duration-300`}>
          {/* Patrón de fondo estático */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}
            />
          </div>

          {/* Capa de degradado oscuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

          {/* Gloss effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
          </div>

          {/* Badge Content */}
          <div className="relative z-10">
            {/* Current League Tag */}
            {isCurrentLeague && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-violet-600 text-xs font-bold rounded-full shadow-lg z-20">
                Actual
              </div>
            )}

            {/* Icon Container */}
            <div className="flex flex-col items-center">
              <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 text-4xl ${
                isUnlocked
                  ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-110'
                  : 'bg-white/5'
              }`}>
                {league.icon}
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-white">
                {league.name}
              </h3>

              {/* Level or Requirement */}
              {isCurrentLeague ? (
                <button
                  onClick={onShowLevels}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
                >
                  <Crown className="w-4 h-4 text-white/80" />
                  <span className="text-sm text-white/90">Nivel {currentLevel + 1}</span>
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : index === currentLeague + 1 ? (
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl">
                  <Zap className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">{league.minXP}XP</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20 md:hidden">
        <button
          onClick={() => handleScroll('prev')}
          disabled={currentIndex === 0}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20 md:hidden">
        <button
          onClick={() => handleScroll('next')}
          disabled={currentIndex === leagues.length - 1}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-hidden md:overflow-x-auto md:flex md:space-x-6"
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {leagues.map((league, index) => renderLeagueBadge(league, index))}
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center space-x-2 mt-4 md:hidden">
        {leagues.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2 bg-violet-500 rounded-full'
                : 'w-2 h-2 bg-violet-200 hover:bg-violet-300 rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
}