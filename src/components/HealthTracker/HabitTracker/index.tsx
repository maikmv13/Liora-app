import React, { useState, useEffect } from 'react';
import { PlusCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitCreator } from './HabitCreator';
import { HabitEditor } from './components/HabitEditor';
import { HabitsBanner } from './components/HabitsBanner';
import { DailyHabitCard } from './components/DailyHabitCard';
import { AddEntryModal } from './components/AddEntryModal';
import { TIME_SLOTS, TimeSlot } from './constants';
import type { Habit, MoodEntry, DailyEntry } from './types';

export function HabitTracker() {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>(() => {
    const saved = localStorage.getItem('habitEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('habitEntries', JSON.stringify(dailyEntries));
  }, [dailyEntries]);

  useEffect(() => {
    const today = new Date().toDateString();
    const hasToday = dailyEntries.some(entry => 
      new Date(entry.date).toDateString() === today
    );

    if (!hasToday) {
      const newEntry: DailyEntry = {
        date: new Date().toISOString(),
        habits: habits.map(h => ({ id: h.id, isCompleted: false })),
        mood: undefined
      };
      setDailyEntries(prev => [newEntry, ...prev]);
    }
  }, [habits]);

  const habitsByTimeSlot = habits.reduce((acc, habit) => {
    const time = habit.time 
      ? new Date(`2000-01-01T${habit.time}`).getHours() 
      : 8; // Default to 8 AM if no time specified

    let slot: TimeSlot;
    if (time >= TIME_SLOTS.morning.range[0] && time <= TIME_SLOTS.morning.range[1]) {
      slot = 'morning';
    } else if (time >= TIME_SLOTS.afternoon.range[0] && time <= TIME_SLOTS.afternoon.range[1]) {
      slot = 'afternoon';
    } else {
      slot = 'evening';
    }

    if (!acc[slot]) {
      acc[slot] = [];
    }

    acc[slot].push(habit);

    return acc;
  }, {} as Record<TimeSlot, Habit[]>);

  // Sort habits by time within each slot
  Object.keys(habitsByTimeSlot).forEach(slot => {
    habitsByTimeSlot[slot as TimeSlot].sort((a, b) => {
      const timeA = a.time ? new Date(`2000-01-01T${a.time}`).getTime() : 0;
      const timeB = b.time ? new Date(`2000-01-01T${b.time}`).getTime() : 0;
      return timeA - timeB;
    });
  });

  const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'isCompleted'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      isCompleted: false
    };
    setHabits(prev => [newHabit, ...prev]);
    setShowAddHabit(false);
  };

  const handleCompleteHabit = (date: string, habitId: string, completed: boolean) => {
    const entryDate = new Date(date).toDateString();
    const existingEntryIndex = dailyEntries.findIndex(entry => 
      new Date(entry.date).toDateString() === entryDate
    );

    if (existingEntryIndex >= 0) {
      const updatedEntries = [...dailyEntries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        habits: updatedEntries[existingEntryIndex].habits.map(h =>
          h.id === habitId ? { ...h, isCompleted: completed } : h
        )
      };
      setDailyEntries(updatedEntries);
    }
  };

  const handleMoodSelect = (date: string, mood: MoodEntry['mood'], intensity: MoodEntry['intensity']) => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      date,
      mood,
      intensity
    };

    const entryDate = new Date(date).toDateString();
    const existingEntryIndex = dailyEntries.findIndex(entry => 
      new Date(entry.date).toDateString() === entryDate
    );

    if (existingEntryIndex >= 0) {
      const updatedEntries = [...dailyEntries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        mood: newMood
      };
      setDailyEntries(updatedEntries);
    }
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(h => 
      h.id === updatedHabit.id ? updatedHabit : h
    ));
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setDailyEntries(prev => prev.map(entry => ({
      ...entry,
      habits: entry.habits.filter(h => h.id !== habitId)
    })));
  };

  const handleCreateEntry = () => {
    const entryDate = new Date(selectedDate).toDateString();
    const existingEntry = dailyEntries.find(entry => 
      new Date(entry.date).toDateString() === entryDate
    );

    if (existingEntry) {
      alert('Ya existe una entrada para esta fecha');
      return;
    }

    const newEntry: DailyEntry = {
      date: selectedDate,
      habits: habits.map(h => ({ id: h.id, isCompleted: false })),
      mood: undefined
    };

    const updatedEntries = [...dailyEntries];
    const insertIndex = updatedEntries.findIndex(
      entry => new Date(entry.date) < new Date(selectedDate)
    );
    
    if (insertIndex === -1) {
      updatedEntries.push(newEntry);
    } else {
      updatedEntries.splice(insertIndex, 0, newEntry);
    }

    setDailyEntries(updatedEntries);
    setShowAddEntry(false);

    setTimeout(() => {
      const entryElement = document.querySelector(`[data-entry-date="${selectedDate}"]`);
      if (entryElement) {
        entryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setEditingEntry(selectedDate);
    }, 500);
  };

  const sortedEntries = [...dailyEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <HabitsBanner onAddHabit={() => setShowAddHabit(true)} />

      {/* Today's Entry */}
      <DailyHabitCard
        entry={sortedEntries[0] || {
          date: new Date().toISOString(),
          habits: habits.map(habit => ({
            id: habit.id,
            isCompleted: false
          })),
          mood: undefined
        }}
        data-entry-date={sortedEntries[0]?.date || new Date().toISOString()}
        editingEntry={editingEntry}
        setEditingEntry={setEditingEntry}
        habitsByTimeSlot={habitsByTimeSlot}
        handleMoodSelect={handleMoodSelect}
        handleCompleteHabit={handleCompleteHabit}
        setEditingHabit={setEditingHabit}
        isArchived={false}
      />

      {/* Add Entry Button */}
      <motion.button
        onClick={() => setShowAddEntry(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 rounded-2xl bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-center space-x-2">
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Añadir entrada anterior</span>
        </div>
      </motion.button>

      {/* Previous Entries */}
      {sortedEntries.slice(1).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-2">
            <History className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600">Entradas anteriores</h3>
          </div>
          <div className="space-y-6">
            {sortedEntries.slice(1).map(entry => (
              <DailyHabitCard
                key={entry.date}
                data-entry-date={entry.date}
                entry={entry}
                isArchived={true}
                editingEntry={editingEntry}
                setEditingEntry={setEditingEntry}
                habitsByTimeSlot={habitsByTimeSlot}
                handleMoodSelect={handleMoodSelect}
                handleCompleteHabit={handleCompleteHabit}
                setEditingHabit={setEditingHabit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddHabit && (
        <HabitCreator
          onCreateHabit={handleCreateHabit}
          onClose={() => setShowAddHabit(false)}
        />
      )}

      {editingHabit && (
        <HabitEditor
          habit={editingHabit}
          onUpdate={handleUpdateHabit}
          onDelete={handleDeleteHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}

      <AnimatePresence>
        {showAddEntry && (
          <AddEntryModal
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onClose={() => setShowAddEntry(false)}
            onSubmit={handleCreateEntry}
            existingEntries={dailyEntries}
          />
        )}
      </AnimatePresence>
    </div>
  );
}