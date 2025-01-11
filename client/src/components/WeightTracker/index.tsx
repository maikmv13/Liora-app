import React, { useState, useEffect } from 'react';
import { WeightChart } from './WeightChart';
import { WeightStats } from './WeightStats';
import { WeightForm } from './WeightForm';
import { WeightHistory } from './WeightHistory';
import { WeightGoalModal } from './WeightGoalModal';
import { WeightMilestones } from './WeightMilestones';
import { WeightGoalAchievedModal } from './WeightGoalAchievedModal';
import { WeightOnboarding } from './WeightOnboarding';
import { WeightStreak } from './WeightStreak';
import { Scale } from 'lucide-react';

interface WeightEntry {
  date: string;
  weight: number;
}

interface CompletedGoal {
  date: string;
  weight: number;
  targetWeight: number;
}

export function WeightTracker() {
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const hasWeightEntries = localStorage.getItem('weightEntries');
    const hasTargetWeight = localStorage.getItem('targetWeight');
    return !hasWeightEntries && !hasTargetWeight;
  });

  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('weightEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [targetWeight, setTargetWeight] = useState(() => {
    const saved = localStorage.getItem('targetWeight');
    return saved ? parseFloat(saved) : 70;
  });

  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>(() => {
    const saved = localStorage.getItem('completedGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGoalAchievedModal, setShowGoalAchievedModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(2);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('targetWeight', targetWeight.toString());
  }, [targetWeight]);

  useEffect(() => {
    localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
  }, [completedGoals]);

  const handleOnboardingComplete = (initialWeight: number, targetWeight: number) => {
    const newEntry = {
      date: new Date().toISOString(),
      weight: initialWeight
    };
    setEntries([newEntry]);
    setTargetWeight(targetWeight);
    setIsFirstTime(false);
  };

  const handleAddWeight = (weight: number) => {
    const newEntry = {
      date: new Date().toISOString(),
      weight
    };
    setEntries(prev => [newEntry, ...prev]);
    setLastUpdate(newEntry.date);

    // Verificar si se alcanzó el objetivo
    const isGaining = targetWeight > entries[0]?.weight;
    const hasReachedGoal = isGaining 
      ? weight >= targetWeight 
      : weight <= targetWeight;

    if (hasReachedGoal && !completedGoals.some(g => g.targetWeight === targetWeight)) {
      setCompletedGoals(prev => [...prev, {
        date: newEntry.date,
        weight: weight,
        targetWeight: targetWeight
      }]);
      setShowGoalAchievedModal(true);
    }

    // Actualizar racha
    updateStreak(newEntry.date);
  };

  const updateStreak = (newEntryDate: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const entryDate = new Date(newEntryDate).setHours(0, 0, 0, 0);
    const lastEntryDate = entries[0] 
      ? new Date(entries[0].date).setHours(0, 0, 0, 0)
      : null;

    if (entryDate === today) {
      if (!lastEntryDate || lastEntryDate < today) {
        setCurrentStreak(prev => prev + 1);
        setBestStreak(prev => Math.max(prev, currentStreak + 1));
      }
    } else {
      // Si se perdió un día, reducir vidas
      if (lastEntryDate && (entryDate - lastEntryDate) > (24 * 60 * 60 * 1000)) {
        setLives(prev => Math.max(0, prev - 1));
        if (lives === 0) {
          setCurrentStreak(0);
        }
      }
    }
  };

  const getWeekProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return entries.some(entry => 
        new Date(entry.date).toDateString() === date.toDateString()
      );
    });
  };

  const handleDeleteEntry = (date: string) => {
    setEntries(prev => prev.filter(entry => entry.date !== date));
  };

  const handleUpdateTarget = (newTarget: number) => {
    setTargetWeight(newTarget);
    setShowGoalModal(false);
  };

  if (isFirstTime) {
    return <WeightOnboarding onComplete={handleOnboardingComplete} />;
  }

  const currentWeight = entries[0]?.weight || 0;
  const initialWeight = entries[entries.length - 1]?.weight || 0;
  const weightChange = entries.length > 1 
    ? currentWeight - entries[1].weight
    : 0;
  const totalChange = currentWeight - initialWeight;

  return (
    <div className="space-y-6">
      {/* Título con emoji */}
      <div className="flex items-center space-x-3">
        <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Scale className="w-6 h-6 md:w-7 md:h-7 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Control de Peso</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            ⚖️ Registra y monitoriza tu progreso
          </p>
        </div>
      </div>

      {/* Formulario de registro */}
      <WeightForm onSubmit={handleAddWeight} />

      {/* Estadísticas principales con progreso destacado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats principales */}
        <div className="lg:col-span-2">
          <WeightStats
            currentWeight={currentWeight}
            initialWeight={initialWeight}
            targetWeight={targetWeight}
            weightChange={weightChange}
            onEditTarget={() => setShowGoalModal(true)}
          />
        </div>
        {/* Panel de racha */}
        <div>
          <WeightStreak
            currentStreak={currentStreak}
            lives={lives}
            maxLives={2}
            weekProgress={getWeekProgress()}
            bestStreak={bestStreak}
            lastUpdate={lastUpdate}
          />
        </div>
      </div>

      {/* Gráfico y contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeightChart 
            data={[...entries].reverse()} 
            targetWeight={targetWeight}
            completedGoals={completedGoals}
          />
          <WeightHistory 
            entries={entries}
            onDelete={handleDeleteEntry}
          />
        </div>
        <div>
          <WeightMilestones
            currentWeight={currentWeight}
            initialWeight={initialWeight}
            targetWeight={targetWeight}
            streakDays={currentStreak}
            totalLoss={totalChange}
            completedGoals={completedGoals}
          />
        </div>
      </div>

      {/* Modales */}
      <WeightGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        onUpdateTarget={handleUpdateTarget}
      />

      <WeightGoalAchievedModal
        isOpen={showGoalAchievedModal}
        onClose={() => setShowGoalAchievedModal(false)}
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        onSetNewGoal={() => {
          setShowGoalAchievedModal(false);
          setShowGoalModal(true);
        }}
      />
    </div>
  );
}