import React, { useState } from 'react';
import { Plus, X, Activity, Flame, Clock, ChevronRight, Info } from 'lucide-react';
import { ExerciseEntry } from './types';

interface ExerciseFormProps {
  onSubmit: (exercise: Omit<ExerciseEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

const EXERCISE_CATEGORIES = {
  cardio: {
    label: 'Cardio',
    color: 'from-rose-400 to-pink-500',
    exercises: [
      { name: 'Correr', icon: '🏃‍♂️', calories: 600 },
      { name: 'Ciclismo', icon: '🚴‍♂️', calories: 500 },
      { name: 'Natación', icon: '🏊‍♂️', calories: 550 },
      { name: 'Saltar la cuerda', icon: '⭐', calories: 600 },
      { name: 'Elíptica', icon: '🔄', calories: 450 },
      { name: 'Caminata', icon: '🚶‍♂️', calories: 300 },
      { name: 'Bailar', icon: '💃', calories: 400 },
      { name: 'HIIT', icon: '⚡', calories: 700 }
    ]
  },
  strength: {
    label: 'Fuerza',
    color: 'from-blue-400 to-indigo-500',
    exercises: [
      { name: 'Pesas', icon: '🏋️‍♂️', calories: 400 },
      { name: 'Calistenia', icon: '💪', calories: 350 },
      { name: 'Crossfit', icon: '🎯', calories: 600 },
      { name: 'Pilates', icon: '🧘‍♂️', calories: 250 },
      { name: 'TRX', icon: '🔧', calories: 400 },
      { name: 'Bandas elásticas', icon: '➰', calories: 300 },
      { name: 'Circuito', icon: '🔄', calories: 500 }
    ]
  },
  flexibility: {
    label: 'Flexibilidad',
    color: 'from-emerald-400 to-teal-500',
    exercises: [
      { name: 'Yoga', icon: '🧘‍♂️', calories: 200 },
      { name: 'Estiramientos', icon: '🤸‍♂️', calories: 150 },
      { name: 'Tai Chi', icon: '🌊', calories: 200 },
      { name: 'Gimnasia', icon: '🤸‍♀️', calories: 300 },
      { name: 'Movilidad', icon: '🔄', calories: 200 }
    ]
  },
  sports: {
    label: 'Deportes',
    color: 'from-amber-400 to-orange-500',
    exercises: [
      { name: 'Fútbol', icon: '⚽', calories: 500 },
      { name: 'Baloncesto', icon: '🏀', calories: 500 },
      { name: 'Tenis', icon: '🎾', calories: 450 },
      { name: 'Voleibol', icon: '🏐', calories: 400 },
      { name: 'Pádel', icon: '🎾', calories: 400 },
      { name: 'Bádminton', icon: '🏸', calories: 350 },
      { name: 'Ping Pong', icon: '🏓', calories: 300 }
    ]
  }
} as const;

const INTENSITY_LEVELS = [
  { value: 'low', label: 'Baja', icon: '🟢', multiplier: 0.8 },
  { value: 'medium', label: 'Media', icon: '🟡', multiplier: 1 },
  { value: 'high', label: 'Alta', icon: '🔴', multiplier: 1.2 }
] as const;

export function ExerciseForm({ onSubmit, onClose }: ExerciseFormProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EXERCISE_CATEGORIES | null>(null);
  const [exercise, setExercise] = useState({
    name: '',
    duration: 30,
    type: 'cardio' as const,
    intensity: 'medium' as const,
    calories: ''
  });

  const handleSelectExercise = (category: keyof typeof EXERCISE_CATEGORIES, name: string) => {
    const selectedExercise = EXERCISE_CATEGORIES[category].exercises.find(e => e.name === name);
    if (selectedExercise) {
      setExercise(prev => ({
        ...prev,
        name: selectedExercise.name,
        type: category,
        calories: Math.round(
          (selectedExercise.calories / 60) * prev.duration * 
          INTENSITY_LEVELS.find(i => i.value === prev.intensity)!.multiplier
        ).toString()
      }));
    }
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...exercise,
      calories: exercise.calories ? parseInt(exercise.calories) : undefined
    });
  };

  const renderCategorySelection = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-3">Selecciona una categoría</h4>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(EXERCISE_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSelectedCategory(key as keyof typeof EXERCISE_CATEGORIES);
              setStep(2);
            }}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              selectedCategory === key
                ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-lg`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{category.exercises[0].icon}</div>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderExerciseSelection = () => {
    if (!selectedCategory) return null;
    const category = EXERCISE_CATEGORIES[selectedCategory];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Selecciona un ejercicio</h4>
          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Cambiar categoría
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {category.exercises.map((ex) => (
            <button
              key={ex.name}
              type="button"
              onClick={() => handleSelectExercise(selectedCategory, ex.name)}
              className={`p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all hover:scale-105 ${
                exercise.name === ex.name
                  ? `bg-gradient-to-br ${category.color} text-white border-transparent`
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">{ex.icon}</div>
              <span className="text-sm font-medium">{ex.name}</span>
              <div className="text-xs mt-1 opacity-75">
                ~{ex.calories} kcal/hora
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderExerciseDetails = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Configura tu ejercicio</h4>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Cambiar ejercicio
        </button>
      </div>

      {/* Duración e intensidad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (min)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={exercise.duration}
              onChange={e => {
                const duration = parseInt(e.target.value);
                setExercise(prev => ({
                  ...prev,
                  duration,
                  calories: prev.name ? Math.round(
                    (EXERCISE_CATEGORIES[prev.type].exercises.find(ex => ex.name === prev.name)!.calories / 60) * 
                    duration * 
                    INTENSITY_LEVELS.find(i => i.value === prev.intensity)!.multiplier
                  ).toString() : ''
                }));
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="1"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calorías estimadas
          </label>
          <div className="relative">
            <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={exercise.calories}
              onChange={e => setExercise(prev => ({ ...prev, calories: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Kcal"
            />
          </div>
        </div>
      </div>

      {/* Intensidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Intensidad
        </label>
        <div className="grid grid-cols-3 gap-3">
          {INTENSITY_LEVELS.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => {
                setExercise(prev => {
                  const newIntensity = level.value;
                  return {
                    ...prev,
                    intensity: newIntensity,
                    calories: prev.name ? Math.round(
                      (EXERCISE_CATEGORIES[prev.type].exercises.find(ex => ex.name === prev.name)!.calories / 60) * 
                      prev.duration * 
                      level.multiplier
                    ).toString() : ''
                  };
                });
              }}
              className={`p-3 rounded-xl border-2 transition-all ${
                exercise.intensity === level.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{level.icon}</span>
                <span className="text-sm font-medium text-gray-900">{level.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Guardar</span>
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2.5 rounded-xl shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Registrar ejercicio</h3>
              <p className="text-sm text-gray-600">Paso {step} de 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 1 && renderCategorySelection()}
        {step === 2 && renderExerciseSelection()}
        {step === 3 && renderExerciseDetails()}
      </div>
    </div>
  );
}