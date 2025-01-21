import React, { useState } from 'react';
import { CheckSquare, Plus, Settings, Calendar, ChevronDown, ListChecks, Clock } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { MoodSelector } from './MoodSelector';
import { HabitCreator } from './HabitCreator';
import { PRESET_HABITS } from './HabitCreator/constants';
import type { Habit, MoodEntry } from './types';

export function HabitTracker() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showMyHabits, setShowMyHabits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [todayEntry] = useState({
    date: new Date().toISOString(),
    habits: habits.map(habit => ({
      id: habit.id,
      isCompleted: false
    }))
  });

  const [currentMood, setCurrentMood] = useState<MoodEntry | undefined>(() => {
    const saved = localStorage.getItem('todayMood');
    return saved ? JSON.parse(saved) : undefined;
  });

  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<keyof typeof PRESET_HABITS, Habit[]>);

  const handleCompleteHabit = (date: string, habitId: string, completed: boolean) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId ? { ...habit, isCompleted: completed } : habit
    );
    setHabits(updatedHabits);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleMoodSelect = (mood: MoodEntry['mood'], intensity: MoodEntry['intensity']) => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      intensity
    };
    setCurrentMood(newMood);
    localStorage.setItem('todayMood', JSON.stringify(newMood));
  };

  const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'isCompleted'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      isCompleted: false
    };
    setHabits(prev => [newHabit, ...prev]);
    localStorage.setItem('habits', JSON.stringify([newHabit, ...habits]));
  };

  // Format today's date in Spanish
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <CheckSquare className="w-6 h-6 md:w-7 md:h-7 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Hábitos</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Seguimiento de hábitos diarios
          </p>
        </div>
      </div>

      {/* Mis Hábitos */}
      <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100/50">
        <div className="p-4 border-b border-amber-100/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg text-white">
              <ListChecks className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Mis hábitos</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              onClick={() => setShowCalendar(true)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <div
              onClick={() => setShowAddHabit(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo</span>
            </div>
            <div
              onClick={() => setShowMyHabits(!showMyHabits)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  showMyHabits ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>
        <div className={`transition-all duration-300 ${
          showMyHabits 
            ? 'max-h-[2000px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="divide-y divide-amber-100/50">
            {Object.entries(PRESET_HABITS).map(([category, info]) => {
              const categoryHabits = habitsByCategory[category as keyof typeof PRESET_HABITS] || [];
              if (categoryHabits.length === 0) return null;

              return (
                <div key={category} className="overflow-hidden">
                  <div
                    onClick={() => toggleCategory(category)}
                    className={`w-full p-4 text-left hover:bg-white/30 transition-colors cursor-pointer ${
                      expandedCategories[category] ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{info.name}</h4>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedCategories[category] ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ${
                    expandedCategories[category] 
                      ? 'max-h-[1000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryHabits.map(habit => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onComplete={(completed) => 
                            handleCompleteHabit(todayEntry.date, habit.id, completed)
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Entradas del día */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Entradas de hoy</h3>
                <p className="text-sm text-gray-600 capitalize">{today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de estado de ánimo */}
        <div className="p-4 border-b border-gray-100">
          <MoodSelector
            currentMood={currentMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        {/* Lista de hábitos */}
        <div className="p-4">
          {todayEntry.habits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={(completed) => 
                    handleCompleteHabit(todayEntry.date, habit.id, completed)
                  }
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                <ListChecks className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No hay hábitos configurados</h4>
              <p className="text-gray-600">
                Comienza añadiendo algunos hábitos para hacer seguimiento
              </p>
              <div
                onClick={() => setShowAddHabit(true)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 transition-colors inline-flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Añadir hábito</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación de hábito */}
      {showAddHabit && (
        <HabitCreator
          onCreateHabit={handleCreateHabit}
          onClose={() => setShowAddHabit(false)}
        />
      )}
    </div>
  );
}