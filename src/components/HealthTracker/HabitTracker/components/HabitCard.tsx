import React from 'react';
import { Check, Edit, Clock } from 'lucide-react';
import type { Habit } from '../types';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  onComplete: (completed: boolean) => void;
  onEdit: () => void;
  compact?: boolean;
  disabled?: boolean;
}

const CATEGORY_COLORS = {
  physical: {
    gradient: 'from-amber-500 to-orange-600',
    hover: 'hover:from-amber-600 hover:to-orange-700',
    bgLight: 'bg-amber-100',
    textLight: 'text-amber-700',
    borderLight: 'border-amber-200',
    iconBg: 'bg-amber-100/80'
  },
  mental: {
    gradient: 'from-violet-500 to-purple-600',
    hover: 'hover:from-violet-600 hover:to-purple-700',
    bgLight: 'bg-violet-100',
    textLight: 'text-violet-700',
    borderLight: 'border-violet-200',
    iconBg: 'bg-violet-100/80'
  },
  social: {
    gradient: 'from-pink-500 to-rose-600',
    hover: 'hover:from-pink-600 hover:to-rose-700',
    bgLight: 'bg-pink-100',
    textLight: 'text-pink-700',
    borderLight: 'border-pink-200',
    iconBg: 'bg-pink-100/80'
  },
  selfcare: {
    gradient: 'from-emerald-500 to-teal-600',
    hover: 'hover:from-emerald-600 hover:to-teal-700',
    bgLight: 'bg-emerald-100',
    textLight: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    iconBg: 'bg-emerald-100/80'
  },
  productivity: {
    gradient: 'from-blue-500 to-cyan-600',
    hover: 'hover:from-blue-600 hover:to-cyan-700',
    bgLight: 'bg-blue-100',
    textLight: 'text-blue-700',
    borderLight: 'border-blue-200',
    iconBg: 'bg-blue-100/80'
  }
};

export function HabitCard({ habit, onComplete, onEdit, compact = false, disabled = false }: HabitCardProps) {
  const colors = CATEGORY_COLORS[habit.category];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={() => !disabled && onComplete(!habit.isCompleted)}
      className={`group relative w-full overflow-hidden rounded-xl transition-all duration-300 ${
        disabled ? 'opacity-75 cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Card Content */}
      <div className={`relative p-3 ${
        habit.isCompleted 
          ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg`
          : `bg-white/90 backdrop-blur-sm hover:bg-white/95 border ${colors.borderLight}`
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm ${
              habit.isCompleted
                ? 'bg-white/20 text-white'
                : `${colors.iconBg} ${colors.textLight}`
            }`}>
              {habit.icon}
            </div>
            <div className="flex flex-col items-start">
              <span className={`font-medium text-sm ${
                habit.isCompleted ? 'text-white' : 'text-gray-900'
              }`}>
                {habit.title}
              </span>
              {habit.time && (
                <div className="flex items-center space-x-1">
                  <Clock className={`w-3 h-3 ${
                    habit.isCompleted ? 'text-white/80' : colors.textLight
                  }`} />
                  <span className={`text-xs font-medium ${
                    habit.isCompleted ? 'text-white/90' : colors.textLight
                  }`}>
                    {new Date(`2000-01-01T${habit.time}`).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Edit button */}
            {!disabled && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                  habit.isCompleted
                    ? 'text-white/60 hover:bg-white/10'
                    : `${colors.textLight} hover:bg-gray-100`
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
              </motion.div>
            )}

            {/* Checkbox */}
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              habit.isCompleted
                ? 'bg-white border-white text-violet-500'
                : disabled
                ? 'border-gray-300'
                : `border-${colors.borderLight} group-hover:border-violet-500`
            }`}>
              {habit.isCompleted && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {habit.isCompleted && (
          <motion.div
            layoutId={`progress-${habit.id}`}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20"
          >
            <motion.div
              className="absolute inset-0 bg-white/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}

        {/* Shine effect */}
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </div>
    </motion.button>
  );
}