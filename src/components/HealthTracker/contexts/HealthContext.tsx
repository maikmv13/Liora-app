import React, { createContext, useContext, useState, useEffect } from 'react';
import { WillpowerNotification } from '../Notifications/WillpowerNotification';

export const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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
    name: "Explorador Terrestre",
    color: "from-emerald-600 to-green-500",
    icon: "🌍",
    description: "Comienza tu viaje desde la Tierra hacia las estrellas",
    minXP: 0,
    maxXP: 2000,
    levels: [
      { number: 1, title: "Recluta", minXP: 0, perks: ["Acceso a estadísticas básicas", "Seguimiento de progreso"] },
      { number: 2, title: "Cadete", minXP: 400, perks: ["Gráficos semanales", "Logros terrestres"] },
      { number: 3, title: "Aspirante", minXP: 800, perks: ["Análisis de tendencias", "Multiplicador x1.2"] },
      { number: 4, title: "Oficial", minXP: 1200, perks: ["Estadísticas avanzadas", "Multiplicador x1.5"] },
      { number: 5, title: "Comandante", minXP: 1600, perks: ["Desbloquea rango espacial", "Multiplicador x2"] }
    ],
    material: "bg-gradient-to-br from-emerald-600 to-green-500"
  },
  {
    name: "Piloto Espacial",
    color: "from-cyan-500 to-blue-600",
    icon: "🛸",
    description: "Despega hacia la aventura más allá de la atmósfera",
    minXP: 2000,
    maxXP: 5000,
    levels: [
      { number: 1, title: "Piloto Novato", minXP: 2000, perks: ["Análisis orbital", "Logros espaciales"] },
      { number: 2, title: "Piloto Experto", minXP: 2800, perks: ["Multiplicador x2.5", "Medallas espaciales"] },
      { number: 3, title: "As Espacial", minXP: 3600, perks: ["Estadísticas premium", "Multiplicador x3"] },
      { number: 4, title: "Piloto Elite", minXP: 4200, perks: ["Contenido exclusivo", "Multiplicador x3.5"] },
      { number: 5, title: "Capitán", minXP: 4600, perks: ["Desbloquea navegación lunar", "Multiplicador x4"] }
    ],
    material: "bg-gradient-to-br from-cyan-500 to-blue-600"
  },
  {
    name: "Navegante Lunar",
    color: "from-indigo-500 to-violet-600",
    icon: "🌙",
    description: "Explora los misterios de nuestro satélite natural",
    minXP: 5000,
    maxXP: 10000,
    levels: [
      { number: 1, title: "Selenita", minXP: 5000, perks: ["Análisis lunar", "Multiplicador x4.5"] },
      { number: 2, title: "Explorador Lunar", minXP: 6000, perks: ["Logros lunares", "Multiplicador x5"] },
      { number: 3, title: "Pionero Lunar", minXP: 7000, perks: ["Contenido VIP", "Multiplicador x5.5"] },
      { number: 4, title: "Guardián Lunar", minXP: 8000, perks: ["Estadísticas únicas", "Multiplicador x6"] },
      { number: 5, title: "Señor Lunar", minXP: 9000, perks: ["Desbloquea rango planetario", "Multiplicador x7"] }
    ],
    material: "bg-gradient-to-br from-indigo-500 to-violet-600"
  },
  {
    name: "Pionero Planetario",
    color: "from-orange-500 to-red-600",
    icon: "🪐",
    description: "Aventúrate en la exploración del sistema solar",
    minXP: 10000,
    maxXP: 20000,
    levels: [
      { number: 1, title: "Explorador Solar", minXP: 10000, perks: ["Análisis planetario", "Multiplicador x8"] },
      { number: 2, title: "Colonizador", minXP: 12500, perks: ["Contenido exclusivo", "Multiplicador x9"] },
      { number: 3, title: "Terraformador", minXP: 15000, perks: ["Logros planetarios", "Multiplicador x10"] },
      { number: 4, title: "Guardián Solar", minXP: 17500, perks: ["Estadísticas solares", "Multiplicador x11"] },
      { number: 5, title: "Señor Planetario", minXP: 19000, perks: ["Desbloquea rango estelar", "Multiplicador x12"] }
    ],
    material: "bg-gradient-to-br from-orange-500 to-red-600"
  },
  {
    name: "Capitán Estelar",
    color: "from-yellow-400 to-amber-500",
    icon: "⭐",
    description: "Domina los secretos de las estrellas",
    minXP: 20000,
    maxXP: 35000,
    levels: [
      { number: 1, title: "Viajero Estelar", minXP: 20000, perks: ["Análisis estelar", "Multiplicador x13"] },
      { number: 2, title: "Cartógrafo Estelar", minXP: 25000, perks: ["Logros estelares", "Multiplicador x14"] },
      { number: 3, title: "Guardián Estelar", minXP: 30000, perks: ["Contenido premium", "Multiplicador x15"] },
      { number: 4, title: "Señor Estelar", minXP: 32500, perks: ["Estadísticas estelares", "Multiplicador x16"] },
      { number: 5, title: "Maestro Estelar", minXP: 34000, perks: ["Desbloquea rango galáctico", "Multiplicador x17"] }
    ],
    material: "bg-gradient-to-br from-yellow-400 to-amber-500"
  },
  {
    name: "Comandante Galáctico",
    color: "from-purple-500 to-pink-600",
    icon: "🌌",
    description: "Lidera expediciones a través de la galaxia",
    minXP: 35000,
    maxXP: 50000,
    levels: [
      { number: 1, title: "Explorador Galáctico", minXP: 35000, perks: ["Análisis galáctico", "Multiplicador x18"] },
      { number: 2, title: "Cartógrafo Galáctico", minXP: 40000, perks: ["Logros galácticos", "Multiplicador x19"] },
      { number: 3, title: "Guardián Galáctico", minXP: 45000, perks: ["Contenido legendario", "Multiplicador x20"] },
      { number: 4, title: "Señor Galáctico", minXP: 47500, perks: ["Estadísticas galácticas", "Multiplicador x21"] },
      { number: 5, title: "Maestro Galáctico", minXP: 49000, perks: ["Desbloquea rango cósmico", "Multiplicador x22"] }
    ],
    material: "bg-gradient-to-br from-purple-500 to-pink-600"
  },
  {
    name: "Guardián Cósmico",
    color: "from-fuchsia-500 to-rose-600",
    icon: "☄️",
    description: "Protege los secretos del cosmos",
    minXP: 50000,
    maxXP: 75000,
    levels: [
      { number: 1, title: "Protector Cósmico", minXP: 50000, perks: ["Análisis cósmico", "Multiplicador x23"] },
      { number: 2, title: "Vigilante Cósmico", minXP: 60000, perks: ["Logros cósmicos", "Multiplicador x24"] },
      { number: 3, title: "Custodio Cósmico", minXP: 70000, perks: ["Contenido mítico", "Multiplicador x25"] },
      { number: 4, title: "Señor Cósmico", minXP: 72500, perks: ["Estadísticas cósmicas", "Multiplicador x26"] },
      { number: 5, title: "Maestro Cósmico", minXP: 74000, perks: ["Desbloquea rango astral", "Multiplicador x27"] }
    ],
    material: "bg-gradient-to-br from-fuchsia-500 to-rose-600"
  },
  {
    name: "Almirante Astral",
    color: "from-sky-400 to-blue-500",
    icon: "🚀",
    description: "Comanda las fuerzas del universo conocido",
    minXP: 75000,
    maxXP: 100000,
    levels: [
      { number: 1, title: "Comandante Astral", minXP: 75000, perks: ["Análisis astral", "Multiplicador x28"] },
      { number: 2, title: "Estratega Astral", minXP: 85000, perks: ["Logros astrales", "Multiplicador x29"] },
      { number: 3, title: "Guardián Astral", minXP: 95000, perks: ["Contenido supremo", "Multiplicador x30"] },
      { number: 4, title: "Señor Astral", minXP: 97500, perks: ["Estadísticas astrales", "Multiplicador x31"] },
      { number: 5, title: "Maestro Astral", minXP: 99000, perks: ["Desbloquea rango universal", "Multiplicador x32"] }
    ],
    material: "bg-gradient-to-br from-sky-400 to-blue-500"
  },
  {
    name: "Maestro del Universo",
    color: "from-violet-500 to-purple-600",
    icon: "⚡",
    description: "Alcanza la maestría suprema del cosmos",
    minXP: 100000,
    maxXP: 150000,
    levels: [
      { number: 1, title: "Sabio Universal", minXP: 100000, perks: ["Análisis universal", "Multiplicador x33"] },
      { number: 2, title: "Guardián Universal", minXP: 120000, perks: ["Logros universales", "Multiplicador x34"] },
      { number: 3, title: "Protector Universal", minXP: 140000, perks: ["Contenido divino", "Multiplicador x35"] },
      { number: 4, title: "Señor Universal", minXP: 145000, perks: ["Estadísticas universales", "Multiplicador x36"] },
      { number: 5, title: "Maestro Universal", minXP: 148000, perks: ["Desbloquea rango legendario", "Multiplicador x37"] }
    ],
    material: "bg-gradient-to-br from-violet-500 to-purple-600"
  },
  {
    name: "Leyenda Intergaláctica",
    color: "from-rose-500 to-pink-600",
    icon: "✨",
    description: "Trasciende los límites del universo conocido",
    minXP: 150000,
    maxXP: 200000,
    levels: [
      { number: 1, title: "Héroe Legendario", minXP: 150000, perks: ["Análisis legendario", "Multiplicador x38"] },
      { number: 2, title: "Guardián Legendario", minXP: 165000, perks: ["Logros legendarios", "Multiplicador x39"] },
      { number: 3, title: "Protector Legendario", minXP: 180000, perks: ["Contenido infinito", "Multiplicador x40"] },
      { number: 4, title: "Señor Legendario", minXP: 190000, perks: ["Estadísticas legendarias", "Multiplicador x41"] },
      { number: 5, title: "Maestro Legendario", minXP: 195000, perks: ["Rango máximo alcanzado", "Multiplicador x42"] }
    ],
    material: "bg-gradient-to-br from-rose-500 to-pink-600"
  }
];

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