import React, { createContext, useContext, useState, useEffect } from 'react';
import { WillpowerNotification } from '../Notifications/WillpowerNotification';

export interface LeagueInfo {
  name: string;
  color: string;
  icon: string;
  description: string;
  minXP: number;
  maxXP: number;
  levels: Array<{
    number: number;
    title: string;
    minXP: number;
    perks: string[];
  }>;
  material: string;
}

export const LEAGUES: LeagueInfo[] = [
  {
    name: "Bronce",
    color: "from-amber-800 to-amber-600",
    icon: "🥉",
    description: "Comienza tu viaje hacia un estilo de vida más saludable",
    minXP: 0,
    maxXP: 2000,
    levels: [
      { number: 1, title: "Novato", minXP: 0, perks: ["Acceso a estadísticas básicas", "Seguimiento de peso"] },
      { number: 2, title: "Aprendiz", minXP: 400, perks: ["Gráficos semanales", "Logros básicos"] },
      { number: 3, title: "Iniciado", minXP: 800, perks: ["Análisis de tendencias", "Multiplicador x1.2"] },
      { number: 4, title: "Aspirante", minXP: 1200, perks: ["Estadísticas avanzadas", "Multiplicador x1.5"] },
      { number: 5, title: "Graduado", minXP: 1600, perks: ["Desbloquea liga Plata", "Multiplicador x2"] }
    ],
    material: "bg-gradient-to-br from-[#CD7F32] to-[#B87333]"
  },
  {
    name: "Plata",
    color: "from-slate-400 to-slate-300",
    icon: "🥈",
    description: "Demuestra tu dedicación y constancia",
    minXP: 2000,
    maxXP: 5000,
    levels: [
      { number: 1, title: "Disciplinado", minXP: 2000, perks: ["Análisis detallado", "Logros especiales"] },
      { number: 2, title: "Constante", minXP: 2800, perks: ["Multiplicador x2.5", "Medallas exclusivas"] },
      { number: 3, title: "Dedicado", minXP: 3600, perks: ["Estadísticas premium", "Multiplicador x3"] },
      { number: 4, title: "Experto", minXP: 4200, perks: ["Contenido exclusivo", "Multiplicador x3.5"] },
      { number: 5, title: "Maestro", minXP: 4600, perks: ["Desbloquea liga Oro", "Multiplicador x4"] }
    ],
    material: "bg-gradient-to-br from-[#C0C0C0] to-[#D3D3D3]"
  },
  {
    name: "Oro",
    color: "from-yellow-500 to-amber-400",
    icon: "🥇",
    description: "Alcanza la excelencia en tu bienestar",
    minXP: 5000,
    maxXP: 10000,
    levels: [
      { number: 1, title: "Veterano", minXP: 5000, perks: ["Análisis predictivo", "Multiplicador x4.5"] },
      { number: 2, title: "Élite", minXP: 6000, perks: ["Logros legendarios", "Multiplicador x5"] },
      { number: 3, title: "Campeón", minXP: 7000, perks: ["Contenido VIP", "Multiplicador x5.5"] },
      { number: 4, title: "Leyenda", minXP: 8000, perks: ["Estadísticas únicas", "Multiplicador x6"] },
      { number: 5, title: "Inmortal", minXP: 9000, perks: ["Desbloquea liga Platino", "Multiplicador x7"] }
    ],
    material: "bg-gradient-to-br from-[#FFD700] to-[#FFC000]"
  },
  {
    name: "Platino",
    color: "from-emerald-400 to-teal-300",
    icon: "💎",
    description: "Únete a la élite del bienestar",
    minXP: 10000,
    maxXP: 20000,
    levels: [
      { number: 1, title: "Titán", minXP: 10000, perks: ["Análisis avanzado", "Multiplicador x8"] },
      { number: 2, title: "Semidiós", minXP: 12500, perks: ["Contenido exclusivo", "Multiplicador x9"] },
      { number: 3, title: "Divino", minXP: 15000, perks: ["Logros míticos", "Multiplicador x10"] },
      { number: 4, title: "Celestial", minXP: 17500, perks: ["Estadísticas divinas", "Multiplicador x11"] },
      { number: 5, title: "Supremo", minXP: 19000, perks: ["Desbloquea liga Diamante", "Multiplicador x12"] }
    ],
    material: "bg-gradient-to-br from-[#E5E4E2] to-[#D3D3D3]"
  }
];

export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface HealthContextType {
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  lives: number;
  lastUpdate: string | null;
  weekProgress: boolean[];
  addXP: (amount: number) => void;
  updateStreak: (date: string, type: 'weight' | 'water' | 'exercise') => void;
  getLevel: () => { league: number; level: number };
  getLevelProgress: () => number;
  getXPMultiplier: () => number;
  getLeagueInfo: (league: number) => LeagueInfo;
}

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
    return saved ? parseInt(saved) : 2;
  });

  const [lastUpdate, setLastUpdate] = useState<string | null>(() => {
    return localStorage.getItem('lastUpdate');
  });

  const [weekProgress, setWeekProgress] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('weekProgress');
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  const [notification, setNotification] = useState<{ points: number } | null>(null);

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
    const multiplier = getXPMultiplier();
    const totalPoints = amount * multiplier;
    setTotalXP(prev => prev + totalPoints);
    setNotification({ points: totalPoints });
  };

  const updateStreak = (date: string, type: 'weight' | 'water' | 'exercise') => {
    if (type === 'water') return;

    const today = new Date().setHours(0, 0, 0, 0);
    const updateDate = new Date(date).setHours(0, 0, 0, 0);
    const lastUpdateDate = lastUpdate 
      ? new Date(lastUpdate).setHours(0, 0, 0, 0)
      : null;

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
    const league = LEAGUES.findIndex((l, i) => 
      totalXP >= l.minXP && (i === LEAGUES.length - 1 || totalXP < LEAGUES[i + 1].minXP)
    );
    const currentLeague = LEAGUES[league];
    const currentLevel = currentLeague.levels.findIndex((l, i) => 
      totalXP >= l.minXP && (i === currentLeague.levels.length - 1 || totalXP < currentLeague.levels[i + 1].minXP)
    );

    return { league, level: currentLevel };
  };

  const getLevelProgress = () => {
    const { league, level } = getLevel();
    const currentLeague = LEAGUES[league];
    const currentLevel = currentLeague.levels[level];
    const nextLevel = currentLeague.levels[level + 1];
    
    if (!nextLevel) return 100;
    
    const levelXP = totalXP - currentLevel.minXP;
    const levelRange = nextLevel.minXP - currentLevel.minXP;
    return (levelXP / levelRange) * 100;
  };

  const getXPMultiplier = () => {
    if (currentStreak >= 30) return 3;
    if (currentStreak >= 15) return 2;
    if (currentStreak >= 7) return 1.5;
    return 1;
  };

  const getLeagueInfo = (league: number) => LEAGUES[league];

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
      getLeagueInfo
    }}>
      {children}
      {notification && (
        <WillpowerNotification
          points={notification.points}
          onClose={() => setNotification(null)}
        />
      )}
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