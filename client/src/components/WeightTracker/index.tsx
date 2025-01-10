import React, { useState, useEffect } from 'react';
import { WeightChart } from './WeightChart';
import { WeightStats } from './WeightStats';
import { WeightForm } from './WeightForm';
import { WeightHistory } from './WeightHistory';
import { WeightGoalModal } from './WeightGoalModal';
import { WeightMilestones } from './WeightMilestones';
import { WeightGoalAchievedModal } from './WeightGoalAchievedModal';
import { WeightOnboarding } from './WeightOnboarding';

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
    // Comprobar si existe algún dato guardado
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
  const [streakDays, setStreakDays] = useState(0);

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
    // Calcular racha actual
    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date).setHours(0, 0, 0, 0);
      const prevDate = i > 0 
        ? new Date(entries[i - 1].date).setHours(0, 0, 0, 0)
        : today;
      
      const diffDays = Math.floor((prevDate - entryDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
      } else {
        break;
      }
    }
    
    setStreakDays(streak);
  }, [entries]);

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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Control de Peso</h2>
        <p className="text-sm md:text-base text-gray-600 mt-1">Registra y monitoriza tu progreso</p>
      </div>

      <WeightForm onSubmit={handleAddWeight} />

      <WeightStats
        currentWeight={currentWeight}
        initialWeight={initialWeight}
        targetWeight={targetWeight}
        weightChange={weightChange}
        onEditTarget={() => setShowGoalModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
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
            streakDays={streakDays}
            totalLoss={totalChange}
            completedGoals={completedGoals}
          />
        </div>
      </div>

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