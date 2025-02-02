import React from 'react';
import { Calendar, Clock, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodSelector } from './MoodSelector';
import { HabitCard } from './HabitCard';
import { TIME_SLOTS, TimeSlot } from '../constants';
import type { DailyEntry, Habit } from '../types';

interface DailyEntryProps {
  entry: DailyEntry;
  isArchived?: boolean;
  editingEntry: string | null;
  setEditingEntry: (date: string | null) => void;
  habitsByTimeSlot: Record<TimeSlot, Habit[]>;
  handleMoodSelect: (date: string, mood: string, intensity: number) => void;
  handleCompleteHabit: (date: string, habitId: string, completed: boolean) => void;
  setEditingHabit: (habit: Habit | null) => void;
}

export function DailyEntryComponent({
  entry,
  isArchived = false,
  editingEntry,
  setEditingEntry,
  habitsByTimeSlot,
  handleMoodSelect,
  handleCompleteHabit,
  setEditingHabit
}: DailyEntryProps) {
  const entryDate = new Date(entry.date);
  const isEditing = editingEntry === entry.date;
  const isToday = entryDate.toDateString() === new Date().toDateString();

  return (
    <motion.div 
      className={`relative bg-white rounded-2xl p-6 border border-amber-100 transition-all duration-300 ${
        isEditing ? 'ring-2 ring-violet-500 shadow-lg' : ''
      }`}
      animate={{
        scale: isEditing ? 1.01 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {entryDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">
                {entryDate.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
        <motion.button
          onClick={() => setEditingEntry(isEditing ? null : entry.date)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isEditing 
              ? 'bg-violet-500 text-white shadow-lg'
              : 'hover:bg-amber-50 text-amber-500'
          }`}
        >
          {isEditing ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -20, 20, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Unlock className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [-10, 10, 0] }}
            >
              <Lock className="w-5 h-5" />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Overlay for locked archived entries */}
      <AnimatePresence>
        {isArchived && !isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/40 rounded-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="space-y-6">
        <div className="mb-6">
          <MoodSelector
            currentMood={entry.mood}
            onMoodSelect={(mood, intensity) => handleMoodSelect(entry.date, mood, intensity)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-6">
          {Object.entries(TIME_SLOTS).map(([slot, { label, icon: Icon, gradient }]) => (
            <div key={slot} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium text-gray-900">{label}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {habitsByTimeSlot[slot as TimeSlot]?.map(habit => {
                  const habitEntry = entry.habits.find(h => h.id === habit.id);
                  return (
                    <HabitCard
                      key={habit.id}
                      habit={{ ...habit, isCompleted: habitEntry?.isCompleted || false }}
                      onComplete={(completed) => 
                        isEditing && handleCompleteHabit(entry.date, habit.id, completed)
                      }
                      onEdit={() => isEditing && setEditingHabit(habit)}
                      compact
                      disabled={!isEditing}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}