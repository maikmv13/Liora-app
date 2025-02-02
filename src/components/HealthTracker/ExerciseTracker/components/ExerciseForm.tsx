import React, { useState } from 'react';
import { Plus, X, Activity, Flame, Clock, ChevronRight, Info } from 'lucide-react';
import { ExerciseEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseFormProps {
  onSubmit: (exercise: Omit<ExerciseEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

const EXERCISE_CATEGORIES = {
  cardio: {
    label: 'Cardio',
    color: 'from-emerald-400 to-teal-500',
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
    color: 'from-emerald-500 to-green-600',
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
    color: 'from-green-400 to-emerald-500',
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
    color: 'from-teal-400 to-emerald-500',
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-600 to-green-700">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Header content */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Activity className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registrar ejercicio</h3>
                <p className="text-sm text-emerald-100">Paso {step} de 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber !== 3 && 'flex-1'}`}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: stepNumber === step ? 1 : 0.8,
                    opacity: 1 
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNumber === step
                      ? 'bg-white text-emerald-600 shadow-lg'
                      : stepNumber < step
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {stepNumber < step ? '✓' : stepNumber}
                </motion.div>
                {stepNumber !== 3 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded ${
                    stepNumber < step
                      ? 'bg-white/20'
                      : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="font-medium text-gray-900">Selecciona una categoría</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ¿Qué tipo de ejercicio vas a realizar?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(EXERCISE_CATEGORIES).map(([key, category]) => (
                      <motion.button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key as keyof typeof EXERCISE_CATEGORIES);
                          setStep(2);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedCategory === key
                            ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-lg`
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                        }`}
                      >
                        <div className="text-2xl mb-2">{category.exercises[0].icon}</div>
                        <span className="text-sm font-medium">{category.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && selectedCategory && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${EXERCISE_CATEGORIES[selectedCategory].color} flex items-center justify-center text-white`}>
                        {EXERCISE_CATEGORIES[selectedCategory].exercises[0].icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{EXERCISE_CATEGORIES[selectedCategory].label}</h4>
                        <p className="text-sm text-gray-600">Selecciona un ejercicio</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      ← Cambiar categoría
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {EXERCISE_CATEGORIES[selectedCategory].exercises.map((ex) => (
                      <motion.button
                        key={ex.name}
                        onClick={() => handleSelectExercise(selectedCategory, ex.name)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-200 transition-all bg-white hover:bg-emerald-50/30"
                      >
                        <div className="text-2xl mb-2">{ex.icon}</div>
                        <span className="text-sm font-medium text-gray-900">{ex.name}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          ~{ex.calories} kcal/hora
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${EXERCISE_CATEGORIES[exercise.type].color} text-white`}>
                        {EXERCISE_CATEGORIES[exercise.type].exercises.find(e => e.name === exercise.name)?.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <p className="text-sm text-gray-600">Configura tu ejercicio</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
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
                          step="1"
                          value={exercise.duration}
                          onChange={(e) => {
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
                          onChange={(e) => setExercise(prev => ({ ...prev, calories: e.target.value }))}
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
                        <motion.button
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            exercise.intensity === level.value
                              ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                              : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-lg">{level.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{level.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl hover:from-emerald-500 hover:to-green-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Guardar</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}