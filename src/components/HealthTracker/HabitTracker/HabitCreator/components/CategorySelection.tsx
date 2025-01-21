import React from 'react';
import { Sparkles } from 'lucide-react';
import { CategorySelectionProps } from '../types';
import { PRESET_HABITS } from '../constants';

export function CategorySelection({ selectedCategory, onSelectCategory }: CategorySelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Elige una categoría
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona el tipo de hábito que quieres crear
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(PRESET_HABITS).map(([key, category]) => (
          <button
            key={key}
            onClick={() => onSelectCategory(key as keyof typeof PRESET_HABITS)}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              selectedCategory === key
                ? 'border-transparent bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg'
                : 'border-gray-200 hover:border-amber-200'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}