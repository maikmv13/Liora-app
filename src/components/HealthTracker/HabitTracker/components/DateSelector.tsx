import React from 'react';
import { motion } from 'framer-motion';
import { DailyEntry } from '../types';

interface DateSelectorProps {
  selectedDate: string;
  onChange: (date: string) => void;
  existingEntries: DailyEntry[];
}

export function DateSelector({ selectedDate, onChange, existingEntries }: DateSelectorProps) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date;
  }).reverse();

  const hasEntryForDate = (date: Date) => {
    return existingEntries.some(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (date > today) return; // No permitir fechas futuras
    if (hasEntryForDate(date)) return; // No permitir fechas con entradas existentes
    
    // Mantener la hora actual al cambiar la fecha
    const currentTime = new Date(selectedDate);
    date.setHours(currentTime.getHours(), currentTime.getMinutes());
    onChange(date.toISOString());
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {/* Días de la semana */}
        {days.map((day, i) => (
          <div key={day} className="text-center">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}

        {/* Fechas */}
        {dates.map((date) => {
          const isSelected = new Date(selectedDate).toDateString() === date.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const hasEntry = hasEntryForDate(date);
          const isDisabled = isFuture || hasEntry;
          
          return (
            <motion.button
              key={date.toISOString()}
              whileHover={!isDisabled ? { scale: 1.05 } : undefined}
              whileTap={!isDisabled ? { scale: 0.95 } : undefined}
              onClick={() => !isDisabled && handleDateClick(date)}
              disabled={isDisabled}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                isDisabled
                  ? hasEntry
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'opacity-50 cursor-not-allowed bg-gray-100'
                  : isSelected
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg'
                  : isToday
                  ? 'bg-violet-50 border-2 border-violet-200'
                  : 'hover:bg-violet-50 bg-white'
              }`}
            >
              <span className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-gray-900'
              }`}>
                {date.getDate()}
              </span>
              {isToday && (
                <span className="text-[10px] text-violet-500 font-medium">
                  HOY
                </span>
              )}
              {hasEntry && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-gray-400 rounded-full"
                />
              )}
              {isSelected && (
                <motion.div
                  layoutId="selectedDate"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 -z-10"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selector de hora */}
      <div className="bg-violet-50 p-4 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hora
        </label>
        <input
          type="time"
          value={new Date(selectedDate).toTimeString().slice(0, 5)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':');
            const newDate = new Date(selectedDate);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            onChange(newDate.toISOString());
          }}
          className="w-full px-4 py-2.5 bg-white rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-500"
        />
      </div>
    </div>
  );
}