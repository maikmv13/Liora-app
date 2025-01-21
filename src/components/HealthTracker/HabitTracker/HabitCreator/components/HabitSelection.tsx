import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { HabitSelectionProps } from '../types';
import { PRESET_HABITS } from '../constants';

export function HabitSelection({ 
  selectedCategory, 
  onSelectPreset, 
  onCustomHabit,
  onBack 
}: HabitSelectionProps) {
  const category = PRESET_HABITS[selectedCategory];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
            {category.icon}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{category.name}</h4>
            <p className="text-sm text-gray-600">Selecciona o crea un hábito</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-amber-600 hover:text-amber-700"
        >
          ← Cambiar categoría
        </button>
      </div>

      <div className="space-y-3">
        {category.habits.map((habit) => (
          <button
            key={habit.title}
            onClick={() => onSelectPreset(habit)}
            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-amber-200 transition-all hover:scale-[1.02] bg-white"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{habit.icon}</span>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-gray-900">{habit.title}</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}

        <button
          onClick={onCustomHabit}
          className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-300 transition-all hover:scale-[1.02] bg-amber-50/50"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-amber-600">Crear hábito personalizado</span>
          </div>
        </button>
      </div>
    </div>
  );
}