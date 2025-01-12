import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeightEntry } from '../components/HealthTracker/WeightTracker/types';

interface HealthContextType {
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  lives: number;
  lastUpdate: string | null;
  weekProgress: boolean[];
  addXP: (amount: number) => void;
  updateStreak: (date: string, type: 'weight' | 'water' | 'exercise') => void;
  getLevel: () => number;
  getLevelProgress: () => number;
  getXPMultiplier: () => number;
}

const LEVEL_THRESHOLDS = [0, 300, 700, 1200, 2000, 3000, 4500, 6500, 9000, 12000];
const LEVEL_TITLES = [
  '🌱 Principiante',
  '🌿 Constante',
  '🌳 Dedicado',
  '⭐ Disciplinado',
  '🌟 Experto',
  '💫 Maestro',
  '🏆 Campeón',
  '👑 Elite',
  '⚡ Legendario',
  '🔥 Supremo'
];

const MAX_LIVES = 2;
const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('healthXP');
    return saved ? parseInt(saved) : 0;
  });

  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('currentStreak');
    return saved ? parseInt(saved) : 0;
  });

  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('bestStreak');
    return saved ? parseInt(saved) : 0;
  });

  const [lives, setLives] = useState(() => {
    const saved = localStorage.getItem('streakLives');
    return saved ? parseInt(saved) : MAX_LIVES;
  });

  const [lastUpdate, setLastUpdate] = useState<string | null>(() => {
    return localStorage.getItem('lastUpdate');
  });

  const [weekProgress, setWeekProgress] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('weekProgress');
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  useEffect(() => {
    localStorage.setItem('healthXP', totalXP.toString());
  }, [totalXP]);

  useEffect(() => {
    localStorage.setItem('currentStreak', currentStreak.toString());
  }, [currentStreak]);

  useEffect(() => {
    localStorage.setItem('bestStreak', bestStreak.toString());
  }, [bestStreak]);

  useEffect(() => {
    localStorage.setItem('streakLives', lives.toString());
  }, [lives]);

  useEffect(() => {
    if (lastUpdate) {
      localStorage.setItem('lastUpdate', lastUpdate);
    }
  }, [lastUpdate]);

  useEffect(() => {
    localStorage.setItem('weekProgress', JSON.stringify(weekProgress));
  }, [weekProgress]);

  const addXP = (amount: number) => {
    setTotalXP(prev => prev + amount * getXPMultiplier());
  };

  const updateStreak = (date: string, type: 'weight' | 'water' | 'exercise') => {
    // La hidratación solo da XP, no afecta a la racha
    if (type === 'water') {
      return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const updateDate = new Date(date).setHours(0, 0, 0, 0);
    const lastUpdateDate = lastUpdate 
      ? new Date(lastUpdate).setHours(0, 0, 0, 0)
      : null;

    // Actualizar progreso semanal
    const newWeekProgress = [...weekProgress];
    const dayIndex = new Date(date).getDay();
    newWeekProgress[dayIndex] = true;
    setWeekProgress(newWeekProgress);

    if (updateDate === today) {
      if (!lastUpdateDate || lastUpdateDate < today) {
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        setBestStreak(prev => Math.max(prev, newStreak));
      }
    } else {
      if (lastUpdateDate && (updateDate - lastUpdateDate) > (24 * 60 * 60 * 1000)) {
        setLives(prev => {
          const newLives = Math.max(0, prev - 1);
          if (newLives === 0) {
            setCurrentStreak(0);
          }
          return newLives;
        });
      }
    }

    setLastUpdate(date);
  };

  const getLevel = () => {
    return LEVEL_THRESHOLDS.findIndex((threshold, index) => 
      totalXP >= threshold && (index === LEVEL_THRESHOLDS.length - 1 || totalXP < LEVEL_THRESHOLDS[index + 1])
    );
  };

  const getLevelProgress = () => {
    const level = getLevel();
    if (level === LEVEL_THRESHOLDS.length - 1) return 100;
    const currentThreshold = LEVEL_THRESHOLDS[level];
    const nextThreshold = LEVEL_THRESHOLDS[level + 1];
    return ((totalXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  const getXPMultiplier = () => {
    if (currentStreak >= 30) return 3;
    if (currentStreak >= 15) return 2;
    if (currentStreak >= 7) return 1.5;
    return 1;
  };

  return (
    <HealthContext.Provider value={{
      totalXP,
      currentStreak,
      bestStreak,
      lives,
      lastUpdate,
      weekProgress,
      addXP,
      updateStreak,
      getLevel,
      getLevelProgress,
      getXPMultiplier,
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}

export { LEVEL_THRESHOLDS, LEVEL_TITLES, WEEK_DAYS };