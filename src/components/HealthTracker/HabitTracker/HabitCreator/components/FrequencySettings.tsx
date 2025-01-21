import React from 'react';
import { Calendar, Bell } from 'lucide-react';
import { FrequencySettingsProps } from '../types';
import { FREQUENCY_OPTIONS, WEEK_DAYS, TIME_OPTIONS } from '../constants';

export function FrequencySettings({
  frequency,
  selectedDays,
  preferredTime,
  customTime,
  reminder,
  onUpdateSettings,
  onBack
}: FrequencySettingsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-amber-500" />
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
            <button
              key={option.value}
              onClick={() => onUpdateSettings({ frequency: option.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </button>
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
              <button
                key={day.value}
                onClick={() => {
                  const newDays = selectedDays.includes(day.value)
                    ? selectedDays.filter(d => d !== day.value)
                    : [...selectedDays, day.value];
                  onUpdateSettings({ selectedDays: newDays });
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  selectedDays.includes(day.value)
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.short}
              </button>
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
            <button
              key={option.value}
              onClick={() => onUpdateSettings({ preferredTime: option.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                preferredTime === option.value
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1 block">{option.icon}</span>
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              {option.time !== 'custom' && (
                <p className="text-xs text-gray-500 mt-1">{option.time}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de hora personalizada */}
      {preferredTime === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora específica
          </label>
          <input
            type="time"
            value={customTime}
            onChange={(e) => onUpdateSettings({ customTime: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      )}

      {/* Recordatorios */}
      <div className="bg-amber-50 p-4 rounded-xl">
        <label className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-amber-500" />
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
                reminder ? 'bg-amber-500' : 'bg-gray-200'
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