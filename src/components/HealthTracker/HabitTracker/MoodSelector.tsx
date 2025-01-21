import React from 'react';
import { Frown, Meh, Smile } from 'lucide-react';
import type { MoodEntry } from './types';

interface MoodSelectorProps {
  currentMood?: MoodEntry;
  onMoodSelect: (mood: MoodEntry['mood'], intensity: MoodEntry['intensity']) => void;
}

const MOODS = [
  { value: 'veryBad', icon: '😫', label: 'Muy mal', color: 'text-red-500' },
  { value: 'bad', icon: '😔', label: 'Mal', color: 'text-orange-500' },
  { value: 'neutral', icon: '😐', label: 'Normal', color: 'text-yellow-500' },
  { value: 'good', icon: '😊', label: 'Bien', color: 'text-emerald-500' },
  { value: 'veryGood', icon: '😁', label: 'Muy bien', color: 'text-green-500' }
] as const;

export function MoodSelector({ currentMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-medium text-gray-900 mb-4">¿Cómo te sientes hoy?</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map(({ value, icon, label, color }) => (
          <button
            key={value}
            onClick={() => onMoodSelect(value, currentMood?.intensity || 3)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
              currentMood?.mood === value
                ? 'bg-gray-100 scale-105'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{icon}</span>
            <span className={`text-xs font-medium ${color}`}>{label}</span>
          </button>
        ))}
      </div>

      {currentMood && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensidad
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={currentMood.intensity}
            onChange={(e) => onMoodSelect(currentMood.mood, parseInt(e.target.value) as MoodEntry['intensity'])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poco</span>
            <span>Medio</span>
            <span>Mucho</span>
          </div>
        </div>
      )}
    </div>
  );
}