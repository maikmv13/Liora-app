import React from 'react';
import { Calendar, Bell, Clock } from 'lucide-react';
import { FrequencySettingsProps } from '../types';
import { FREQUENCY_OPTIONS, WEEK_DAYS, TIME_OPTIONS } from '../constants';
import { motion } from 'framer-motion';

export function FrequencySettings({
  frequency,
  selectedDays,
  preferredTime,
  customTime,
  reminder,
  onUpdateSettings
}: FrequencySettingsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-violet-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Configura la frecuencia
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Establece cuándo quieres realizar este hábito
        </p>
      </div>

      {/* Frecuencia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frecuencia
        </label>
        <div className="grid grid-cols-2 gap-3">
          {FREQUENCY_OPTIONS.map(option => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onUpdateSettings({ frequency: option.value })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === option.value
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/30'
              }`}
            >
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selector de días específicos */}
      {frequency === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días de la semana
          </label>
          <div className="flex justify-between">
            {WEEK_DAYS.map(day => (
              <motion.button
                key={day.value}
                type="button"
                onClick={() => {
                  const newDays = selectedDays.includes(day.value)
                    ? selectedDays.filter(d => d !== day.value)
                    : [...selectedDays, day.value];
                  onUpdateSettings({ selectedDays: newDays });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  selectedDays.includes(day.value)
                    ? 'bg-violet-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-600'
                }`}
              >
                {day.short}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Hora preferida */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mejor momento del día
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TIME_OPTIONS.map(option => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onUpdateSettings({ preferredTime: option.value })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                preferredTime === option.value
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/30'
              }`}
            >
              <span className="text-2xl mb-1 block">{option.icon}</span>
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              {option.time !== 'custom' && (
                <p className="text-xs text-gray-500 mt-1">{option.time}</p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selector de hora personalizada */}
      {preferredTime === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-violet-500" />
              <span>Hora específica</span>
            </label>
            <input
              type="time"
              value={customTime}
              onChange={(e) => onUpdateSettings({ customTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
            <p className="text-xs text-violet-600 mt-2 flex items-center space-x-1">
              <span>💡</span>
              <span>Selecciona la hora exacta para este hábito</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Recordatorios */}
      <div className="bg-violet-50 p-4 rounded-xl">
        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-violet-500" />
            <div>
              <span className="font-medium text-gray-900">Recordatorios</span>
              <p className="text-sm text-gray-600">
                Recibe notificaciones para mantener tu hábito
              </p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => onUpdateSettings({ reminder: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-14 h-8 rounded-full transition-colors ${
                reminder ? 'bg-violet-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  reminder ? 'right-1' : 'left-1'
                } shadow-sm`}
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}