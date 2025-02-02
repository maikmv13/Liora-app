import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar, Star, Trophy, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Ajustar el primer día para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Días de la semana
    weekDays.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-medium text-indigo-300">
          {day}
        </div>
      );
    });

    // Espacios vacíos antes del primer día
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEntry = hasEntryOnDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <motion.div 
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative aspect-square flex flex-col items-center justify-center transition-all duration-300 rounded-xl ${
            hasEntry 
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg'
              : isToday
                ? 'bg-violet-50 border-2 border-violet-300'
                : 'hover:bg-violet-50/50'
          }`}
        >
          <span className={`text-sm font-medium ${
            hasEntry ? 'text-violet-100' : 'text-gray-700'
          }`}>
            {day}
          </span>
          {hasEntry && (
            <>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 mt-1" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full shadow-lg"
              />
            </>
          )}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              {/* Header con gradiente */}
              <div className="relative p-6 bg-gradient-to-br from-violet-600 to-indigo-700">
                {/* Patrón de fondo */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Calendario de Actividad</h3>
                      <p className="text-sm text-indigo-200">{formatMonth(currentDate)}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Stats rápidos */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Racha actual</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">{currentStreak} días</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white">Mejor racha</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-1">{bestStreak} días</p>
                  </div>
                </div>
              </div>

              {/* Navegación del mes */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-violet-50 rounded-xl transition-colors text-violet-500"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    <span className="font-medium text-gray-900">
                      {formatMonth(currentDate)}
                    </span>
                  </div>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-violet-50 rounded-xl transition-colors text-violet-500"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Calendario */}
                {renderCalendar()}

                {/* Botón de cerrar */}
                <button
                  onClick={onClose}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}