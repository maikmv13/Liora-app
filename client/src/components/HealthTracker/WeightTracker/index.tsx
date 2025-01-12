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
import { WeightEntry, CompletedGoal, SubGoal } from './types';

interface WeightTrackerProps {
  onXPGain: (xp: number) => void;
}

export function WeightTracker({ onXPGain }: WeightTrackerProps) {
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

  const [subGoals, setSubGoals] = useState<SubGoal[]>(() => {
    const saved = localStorage.getItem('weightSubGoals');
    return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('weightSubGoals', JSON.stringify(subGoals));
  }, [subGoals]);

  const handleOnboardingComplete = (initialWeight: number, targetWeight: number) => {
    const newEntry = {
      date: new Date().toISOString(),
      weight: initialWeight
    };
    setEntries([newEntry]);
    setTargetWeight(targetWeight);
    setIsFirstTime(false);
    onXPGain(100);
  };

  const handleAddWeight = (weight: number) => {
    const newEntry = {
      date: new Date().toISOString(),
      weight
    };
    setEntries(prev => [newEntry, ...prev]);
    setLastUpdate(newEntry.date);
    onXPGain(50);

    const isGaining = targetWeight > entries[0]?.weight;
    const hasReachedMainGoal = isGaining 
      ? weight >= targetWeight 
      : weight <= targetWeight;

    const hasReachedSubGoal = subGoals.some(goal => {
      const reachedGoal = isGaining
        ? weight >= goal.weight && entries[0]?.weight < goal.weight
        : weight <= goal.weight && entries[0]?.weight > goal.weight;
      return reachedGoal;
    });

    if (hasReachedMainGoal || hasReachedSubGoal) {
      setCompletedGoals(prev => [...prev, {
        date: newEntry.date,
        weight: weight,
        targetWeight: targetWeight
      }]);
      setShowGoalAchievedModal(true);
      onXPGain(200);
    }

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
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        setBestStreak(prev => Math.max(prev, newStreak));
        onXPGain(10 * newStreak);
      }
    } else {
      if (lastEntryDate && (entryDate - lastEntryDate) > (24 * 60 * 60 * 1000)) {
        setLives(prev => {
          const newLives = Math.max(0, prev - 1);
          if (newLives === 0) {
            setCurrentStreak(0);
          }
          return newLives;
        });
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
    const goals = calculateSubGoals(entries[0]?.weight || 0, newTarget);
    setSubGoals(goals);
    setShowGoalModal(false);
    onXPGain(50);
  };

  const calculateSubGoals = (start: number, end: number) => {
    const isGaining = end > start;
    const totalChange = Math.abs(end - start);
    const numberOfGoals = 3;
    const changePerGoal = totalChange / numberOfGoals;

    return Array.from({ length: numberOfGoals }, (_, index) => {
      const progress = (index + 1) / numberOfGoals;
      const weight = isGaining
        ? start + (changePerGoal * (index + 1))
        : start - (changePerGoal * (index + 1));

      return {
        weight: Math.round(weight * 10) / 10,
        description: getGoalDescription(progress, isGaining)
      };
    });
  };

  const getGoalDescription = (progress: number, isGaining: boolean) => {
    const action = isGaining ? 'ganancia' : 'pérdida';
    if (progress <= 0.33) {
      return `Primera meta de ${action}`;
    } else if (progress <= 0.66) {
      return `Punto intermedio de ${action}`;
    } else {
      return 'Objetivo final';
    }
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
    <div className="space-y-6 lg:space-y-8">
      {/* Formulario de registro */}
      <WeightForm onSubmit={handleAddWeight} />

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Panel izquierdo */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          {/* Stats principales */}
          <WeightStats
            currentWeight={currentWeight}
            initialWeight={initialWeight}
            targetWeight={targetWeight}
            weightChange={weightChange}
            onEditTarget={() => setShowGoalModal(true)}
            subGoals={subGoals}
          />

          {/* Gráfico */}
          <WeightChart 
            data={[...entries].reverse()} 
            targetWeight={targetWeight}
            completedGoals={completedGoals}
            subGoals={subGoals}
          />

          {/* Historial */}
          <WeightHistory 
            entries={entries}
            onDelete={handleDeleteEntry}
          />
        </div>

        {/* Panel derecho */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          {/* Panel de racha */}
          <WeightStreak
            currentStreak={currentStreak}
            lives={lives}
            maxLives={2}
            weekProgress={getWeekProgress()}
            bestStreak={bestStreak}
            lastUpdate={lastUpdate}
            weightEntries={entries}
          />

          {/* Logros y objetivos */}
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