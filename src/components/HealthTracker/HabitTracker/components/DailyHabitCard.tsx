import React, { useState } from 'react';
import { Calendar, Lock, Unlock, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodSelector } from './MoodSelector';
import { HabitCard } from './HabitCard';
import { PositiveThings } from './PositiveThings';
import { TIME_SLOTS, TimeSlot } from '../constants';
import type { DailyEntry, Habit } from '../types';

interface DailyHabitCardProps {
  entry: DailyEntry;
  isArchived?: boolean;
  editingEntry: string | null;
  setEditingEntry: (date: string | null) => void;
  habitsByTimeSlot: Record<TimeSlot, Habit[]>;
  handleMoodSelect: (date: string, mood: string, intensity: number) => void;
  handleCompleteHabit: (date: string, habitId: string, completed: boolean) => void;
  setEditingHabit: (habit: Habit | null) => void;
}

export function DailyHabitCard({
  entry,
  isArchived = false,
  editingEntry,
  setEditingEntry,
  habitsByTimeSlot,
  handleMoodSelect,
  handleCompleteHabit,
  setEditingHabit
}: DailyHabitCardProps) {
  const entryDate = new Date(entry.date);
  const isEditing = editingEntry === entry.date;
  const isToday = entryDate.toDateString() === new Date().toDateString();
  const currentHour = new Date().getHours();
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Determine which section should be expanded based on current time
    const sections: Record<string, boolean> = {};
    if (currentHour >= 5 && currentHour < 12) {
      sections.morning = true;
    } else if (currentHour >= 12 && currentHour < 19) {
      sections.afternoon = true;
    } else {
      sections.evening = true;
    }
    return sections;
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 via-orange-600/80 to-amber-800/90" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Calendar className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {entryDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                </div>
                <div className="text-sm text-amber-200">
                  {entryDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setEditingEntry(isEditing ? null : entry.date)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isEditing 
                  ? 'bg-white text-amber-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isEditing ? (
                <Unlock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Mood Selector */}
          <div className="mb-6">
            <MoodSelector
              currentMood={entry.mood}
              onMoodSelect={(mood, intensity) => handleMoodSelect(entry.date, mood, intensity)}
              disabled={!isEditing}
            />
          </div>

          {/* Positive Things */}
          <div className="mb-6">
            <PositiveThings
              entries={entry.positiveThings || ['', '', '']}
              onSave={(things) => {
                // Handle saving positive things
                // You'll need to update your entry type and handlers
              }}
              disabled={!isEditing}
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            {Object.entries(TIME_SLOTS).map(([slot, { label, icon: Icon }]) => (
              <div key={slot} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <button
                  onClick={() => toggleSection(slot)}
                  className="w-full flex items-center justify-between p-4 text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <h4 className="font-medium">{label}</h4>
                  </div>
                  {expandedSections[slot] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections[slot] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Archived Overlay */}
        <AnimatePresence>
          {isArchived && !isEditing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}