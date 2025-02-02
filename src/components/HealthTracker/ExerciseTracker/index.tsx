import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Activity, Calendar, Trophy, Target, ChevronRight, Clock, Flame } from 'lucide-react';
import { ExerciseForm } from './components/ExerciseForm';
import { ExerciseMilestones } from './components/ExerciseMilestones';
import { Activities } from './components/Activities';
import { ExerciseEntry } from './types';
import { useHealth } from '../contexts/HealthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ExerciseTracker() {
  const { updateStreak, addXP } = useHealth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [entries, setEntries] = useState<ExerciseEntry[]>(() => {
    const saved = localStorage.getItem('exerciseEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('exerciseEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddExercise = (exerciseData: Omit<ExerciseEntry, 'id' | 'date'>) => {
    const exercise: ExerciseEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...exerciseData
    };
    
    setEntries(prev => [exercise, ...prev]);
    setShowAddForm(false);

    // Base XP for exercising
    addXP(50);

    // Additional XP based on duration
    const durationXP = Math.floor(exercise.duration / 10) * 20; // 20 XP per 10 minutes
    addXP(durationXP);

    // Bonus XP for longer workouts
    if (exercise.duration >= 60) {
      addXP(100); // Bonus for 1+ hour workout
    }

    // Update streak
    updateStreak(exercise.date, 'exercise');
  };

  const todayExercises = entries.filter(ex => 
    new Date(ex.date).toDateString() === new Date().toDateString()
  );

  const totalMinutesToday = todayExercises.reduce((acc, ex) => acc + ex.duration, 0);
  const dailyGoal = 30; // minutos
  const progress = (totalMinutesToday / dailyGoal) * 100;

  // Estadísticas
  const perfectDays = entries.reduce((acc, curr) => {
    const date = new Date(curr.date).toDateString();
    const totalMinutes = entries
      .filter(ex => new Date(ex.date).toDateString() === date)
      .reduce((sum, ex) => sum + ex.duration, 0);
    return totalMinutes >= dailyGoal ? acc + 1 : acc;
  }, 0);

  const streakDays = entries.reduce((streak, entry) => {
    const date = new Date(entry.date).toDateString();
    const totalMinutes = entries
      .filter(ex => new Date(ex.date).toDateString() === date)
      .reduce((sum, ex) => sum + ex.duration, 0);
    return totalMinutes >= dailyGoal ? streak + 1 : 0;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-800/90" />
          
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            {/* Title Section */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Registro de Ejercicio
                </h1>
                <p className="text-emerald-200 mt-1 flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Mantén un estilo de vida activo</span>
                </p>
              </div>
            </div>

            {/* Add Button */}
            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all duration-300"
            >
              <div className="p-1.5 bg-white/20 rounded-lg transition-colors group-hover:bg-white/30">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-white">
                Registrar Ejercicio
              </span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-300" />
                <span className="text-sm font-medium text-white">Progreso diario</span>
              </div>
              <span className="text-sm text-emerald-200">
                {totalMinutesToday} / {dailyGoal} min
              </span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_1s_infinite_linear]" />
              </motion.div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-white">Hoy</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{totalMinutesToday}m</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-white">Racha</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{streakDays}d</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-white">Mejor</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{perfectDays}d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel izquierdo */}
        <div className="lg:col-span-8 space-y-6">
          {/* Historial */}
          <Activities entries={entries} />
        </div>

        {/* Panel derecho */}
        <div className="lg:col-span-4">
          {/* Logros */}
          <ExerciseMilestones
            currentAmount={totalMinutesToday}
            dailyGoal={dailyGoal}
            totalDays={entries.length}
            perfectDays={perfectDays}
            streakDays={streakDays}
          />
        </div>
      </div>

      {/* Exercise Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ExerciseForm
            onSubmit={handleAddExercise}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}