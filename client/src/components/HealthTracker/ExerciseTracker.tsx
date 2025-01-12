import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Activity, Calendar, Trophy, Target, ChevronRight, Clock, Flame } from 'lucide-react';
import { ExerciseForm } from './ExerciseTracker/ExerciseForm';
import { ExerciseMilestones } from './ExerciseTracker/ExerciseMilestones';
import { ExerciseEntry } from './ExerciseTracker/types';
import { useHealth } from '../context/HealthContext';

interface ExerciseTrackerProps {
  onXPGain: (xp: number) => void;
}

const EXERCISE_COLORS = {
  cardio: 'from-rose-400 to-pink-500',
  strength: 'from-blue-400 to-indigo-500',
  flexibility: 'from-emerald-400 to-teal-500',
  sports: 'from-amber-400 to-orange-500'
};

const INTENSITY_COLORS = {
  low: 'bg-green-100 text-green-600',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-red-100 text-red-600'
};

export function ExerciseTracker({ onXPGain }: ExerciseTrackerProps) {
  const { updateStreak } = useHealth();
  const [exercises, setExercises] = useState<ExerciseEntry[]>(() => {
    const saved = localStorage.getItem('exerciseEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [dailyGoal] = useState(30); // minutos

  useEffect(() => {
    localStorage.setItem('exerciseEntries', JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = (exerciseData: Omit<ExerciseEntry, 'id' | 'date'>) => {
    const exercise: ExerciseEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...exerciseData
    };
    
    setExercises(prev => [exercise, ...prev]);
    setShowAddForm(false);
    onXPGain(100);
    updateStreak(exercise.date, 'exercise');
  };

  const todayExercises = exercises.filter(ex => 
    new Date(ex.date).toDateString() === new Date().toDateString()
  );

  const totalMinutesToday = todayExercises.reduce((acc, ex) => acc + ex.duration, 0);
  const progress = (totalMinutesToday / dailyGoal) * 100;

  // Estadísticas
  const perfectDays = exercises.reduce((acc, curr) => {
    const date = new Date(curr.date).toDateString();
    const totalMinutes = exercises
      .filter(ex => new Date(ex.date).toDateString() === date)
      .reduce((sum, ex) => sum + ex.duration, 0);
    return totalMinutes >= dailyGoal ? acc + 1 : acc;
  }, 0);

  const streakDays = exercises.reduce((streak, entry) => {
    const date = new Date(entry.date).toDateString();
    const totalMinutes = exercises
      .filter(ex => new Date(ex.date).toDateString() === date)
      .reduce((sum, ex) => sum + ex.duration, 0);
    return totalMinutes >= dailyGoal ? streak + 1 : 0;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Panel principal */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <Dumbbell className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ejercicio Diario</h3>
              <p className="text-sm text-gray-600">
                Objetivo: {dailyGoal} minutos
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir</span>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="relative h-8 bg-white rounded-full overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(255,255,255,0.15)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.15)_50%,_rgba(255,255,255,0.15)_75%,_transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_1s_infinite_linear]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {totalMinutesToday} / {dailyGoal} min
            </span>
          </div>
        </div>

        {/* Lista de ejercicios de hoy */}
        <div className="space-y-3">
          {todayExercises.map(exercise => (
            <div key={exercise.id} className="bg-white p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${EXERCISE_COLORS[exercise.type]}`}>
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.duration} min</span>
                      </div>
                      {exercise.calories && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Flame className="w-4 h-4" />
                          <span>{exercise.calories} kcal</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${INTENSITY_COLORS[exercise.intensity]}`}>
                  {exercise.intensity === 'low' ? 'Baja' : exercise.intensity === 'medium' ? 'Media' : 'Alta'}
                </span>
              </div>
            </div>
          ))}
          {todayExercises.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay ejercicios registrados hoy</p>
              <p className="text-sm mt-1">¡Comienza a moverte! 💪</p>
            </div>
          )}
        </div>
      </div>

      {/* Logros y estadísticas */}
      <ExerciseMilestones
        totalMinutes={totalMinutesToday}
        dailyGoal={dailyGoal}
        totalDays={exercises.length}
        perfectDays={perfectDays}
        streakDays={streakDays}
      />

      {/* Modal de formulario */}
      {showAddForm && (
        <ExerciseForm
          onSubmit={addExercise}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}