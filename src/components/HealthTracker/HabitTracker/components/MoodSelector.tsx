import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { MoodEntry } from '../types';

interface MoodSelectorProps {
  currentMood?: MoodEntry;
  onMoodSelect: (mood: MoodEntry['mood']) => void;
  disabled?: boolean;
}

const MOODS = [
  { 
    value: 'veryGood',
    icon: '😁',
    label: 'Excelente',
    gradient: 'from-amber-400 to-orange-500',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
  },
  { 
    value: 'good',
    icon: '😊',
    label: 'Muy bien',
    gradient: 'from-amber-400 to-orange-500',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M0 8h8V0h4v8h8v4h-8v8H8v-8H0V8z'/%3E%3C/g%3E%3C/svg%3E")`
  },
  { 
    value: 'neutral',
    icon: '😐',
    label: 'Bien',
    gradient: 'from-amber-400 to-orange-500',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`
  },
  { 
    value: 'bad',
    icon: '😔',
    label: 'Mal',
    gradient: 'from-amber-400 to-orange-500',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`
  },
  { 
    value: 'veryBad',
    icon: '😫',
    label: 'Muy mal',
    gradient: 'from-amber-400 to-orange-500',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l12 12-12 12L0 12z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`
  }
] as const;

export function MoodSelector({ currentMood, onMoodSelect, disabled = false }: MoodSelectorProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Heart className="w-5 h-5 text-amber-300" />
          </div>
          <h3 className="font-medium text-white">¿Cómo te sientes hoy?</h3>
        </div>
      </div>
      
      {/* Mood Selection */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(({ value, icon, label, gradient, pattern }) => (
            <motion.button
              key={value}
              onClick={() => !disabled && onMoodSelect(value as MoodEntry['mood'])}
              whileHover={!disabled ? { scale: 1.05 } : undefined}
              whileTap={!disabled ? { scale: 0.95 } : undefined}
              className={`relative group ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className={`relative overflow-hidden p-3 rounded-xl transition-all duration-300 ${
                currentMood?.mood === value
                  ? `bg-gradient-to-br ${gradient} shadow-lg`
                  : 'bg-white/5 hover:bg-white/10'
              }`}>
                {/* Background Pattern */}
                {currentMood?.mood === value && (
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: pattern }}
                  />
                )}

                <motion.div 
                  className="flex flex-col items-center relative z-10"
                  animate={{ 
                    scale: currentMood?.mood === value ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl mb-1">{icon}</span>
                  <span className={`text-xs font-medium ${
                    currentMood?.mood === value ? 'text-white' : 'text-white/80'
                  }`}>
                    {label}
                  </span>
                </motion.div>

                {/* Active indicator */}
                {currentMood?.mood === value && (
                  <motion.div
                    layoutId="moodIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                  />
                )}

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}