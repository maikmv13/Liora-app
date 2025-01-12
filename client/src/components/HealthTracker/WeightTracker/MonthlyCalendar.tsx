import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface MonthlyCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  bestStreak: number;
  weightEntries: {
    date: string;
    weight: number;
  }[];
}

export function MonthlyCalendar({ 
  isOpen, 
  onClose, 
  currentStreak,
  bestStreak,
  weightEntries 
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', { 
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const hasEntryOnDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return weightEntries.some(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Ajustar el primer día para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Añadir días vacíos al principio
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Añadir los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEntry = hasEntryOnDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div 
          key={day}
          className={`h-10 flex items-center justify-center relative ${
            hasEntry 
              ? 'bg-rose-50 text-rose-600 font-medium'
              : 'hover:bg-gray-50'
          } ${
            isToday
              ? 'ring-2 ring-rose-500 ring-offset-2'
              : ''
          } rounded-lg transition-all duration-200`}
        >
          <span className="relative z-10">{day}</span>
          {hasEntry && (
            <div className="absolute inset-1 bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg -z-0" />
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Días de la semana */}
        {weekDays.map(day => (
          <div 
            key={day} 
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {/* Calendario */}
        {days}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Calendario de Registros</h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatMonth(currentDate)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-rose-500" />
            <span className="font-medium text-gray-900">
              {formatMonth(currentDate)}
            </span>
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Calendario */}
        {renderCalendar()}

        {/* Estadísticas del mes */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Racha actual</p>
            <p className="text-xl font-bold text-gray-900">{currentStreak} días</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Mejor racha</p>
            <p className="text-xl font-bold text-gray-900">{bestStreak} días</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}