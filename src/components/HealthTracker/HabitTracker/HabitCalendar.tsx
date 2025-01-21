import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyEntry } from './types';

interface HabitCalendarProps {
  entries: DailyEntry[];
  onClose: () => void;
}

export function HabitCalendar({ entries, onClose }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const getEntryForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date.startsWith(dateString));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Días de la semana
    weekDays.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-medium text-gray-500 text-sm">
          {day}
        </div>
      );
    });

    // Espacios vacíos antes del primer día
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = getEntryForDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      const completionRate = entry
        ? (entry.habits.filter(h => h.isCompleted).length / entry.habits.length) * 100
        : 0;

      days.push(
        <div
          key={day}
          className={`relative aspect-square flex flex-col items-center justify-center p-1 rounded-lg transition-all ${
            isToday ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
          } ${
            entry
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50'
              : 'hover:bg-gray-50'
          }`}
        >
          <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>{day}</span>
          {entry && (
            <>
              <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-emerald-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              {entry.mood && (
                <span className="text-xs mt-1">
                  {entry.mood.mood === 'veryGood' ? '😁' :
                   entry.mood.mood === 'good' ? '😊' :
                   entry.mood.mood === 'neutral' ? '😐' :
                   entry.mood.mood === 'bad' ? '😔' : '😫'}
                </span>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Calendario de hábitos</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="text-lg font-medium">
            {currentDate.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric'
            })}
          </h4>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {renderCalendar()}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}