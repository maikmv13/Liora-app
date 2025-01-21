import React from 'react';
import { Settings, Bell, Palette, Shield, X } from 'lucide-react';
import type { Habit } from './types';

interface HabitSettingsProps {
  habits: Habit[];
  onDeleteHabit: (id: string) => void;
  onClose: () => void;
}

export function HabitSettings({ habits, onDeleteHabit, onClose }: HabitSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Hábitos configurados */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Hábitos configurados</h4>
            <div className="space-y-2">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{habit.icon}</span>
                    <span className="font-medium text-gray-900">{habit.title}</span>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notificaciones */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Notificaciones</h4>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">Recordatorios diarios</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  defaultChecked
                />
                <div className="w-10 h-6 bg-emerald-500 rounded-full"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </button>
          </div>

          {/* Tema */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Apariencia</h4>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">Tema claro</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </button>
          </div>

          {/* Privacidad */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Privacidad</h4>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">Datos locales</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  defaultChecked
                />
                <div className="w-10 h-6 bg-emerald-500 rounded-full"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}