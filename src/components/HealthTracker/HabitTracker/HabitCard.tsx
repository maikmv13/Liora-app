import React from 'react';
import { Check } from 'lucide-react';
import type { Habit } from './types';

interface HabitCardProps {
  habit: Habit;
  onComplete: (completed: boolean) => void;
  compact?: boolean;
}

const CATEGORY_COLORS = {
  physical: 'from-blue-400 to-cyan-400',
  mental: 'from-violet-400 to-purple-400',
  social: 'from-pink-400 to-rose-400',
  selfcare: 'from-emerald-400 to-teal-400',
  productivity: 'from-amber-400 to-orange-400'
};

export function HabitCard({ habit, onComplete, compact = false }: HabitCardProps) {
  if (compact) {
    return (
      <button
        onClick={() => onComplete(!habit.isCompleted)}
        className={`group relative w-full p-2 rounded-lg border-2 transition-all ${
          habit.isCompleted 
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
            CATEGORY_COLORS[habit.category]
          } flex items-center justify-center text-white text-sm`}>
            {habit.icon}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {habit.title}
          </span>
          <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            habit.isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 group-hover:border-emerald-500'
          }`}>
            {habit.isCompleted && <Check className="w-3 h-3" />}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onComplete(!habit.isCompleted)}
      className={`group relative w-full p-4 rounded-xl border-2 transition-all ${
        habit.isCompleted 
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
          CATEGORY_COLORS[habit.category]
        } flex items-center justify-center text-white text-xl`}>
          {habit.icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-medium text-gray-900">{habit.title}</h3>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          habit.isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 group-hover:border-emerald-500'
        }`}>
          {habit.isCompleted && <Check className="w-4 h-4" />}
        </div>
      </div>
    </button>
  );
}