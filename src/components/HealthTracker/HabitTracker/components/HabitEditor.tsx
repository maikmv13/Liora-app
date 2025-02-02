import React, { useState } from 'react';
import { X, Target, Clock, Bell, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICON_CATEGORIES, FREQUENCY_OPTIONS, WEEK_DAYS, TIME_OPTIONS } from '../HabitCreator/constants';

interface HabitEditorProps {
  habit: Habit;
  onUpdate: (updatedHabit: Habit) => void;
  onDelete: (habitId: string) => void;
  onClose: () => void;
}

export function HabitEditor({ habit, onUpdate, onDelete, onClose }: HabitEditorProps) {
  const [editedHabit, setEditedHabit] = useState(habit);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedHabit);
  };

  const handleDelete = () => {
    onDelete(habit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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

          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">Editar hábito</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre del hábito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del hábito
            </label>
            <input
              type="text"
              value={editedHabit.title}
              onChange={(e) => setEditedHabit({ ...editedHabit, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icono
            </label>
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 hover:border-violet-500 text-left flex items-center space-x-2"
            >
              <span className="text-xl">{editedHabit.icon}</span>
              <span className="text-sm text-gray-500">Cambiar icono</span>
            </button>
          </div>

          {/* Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia
            </label>
            <select
              value={editedHabit.frequency}
              onChange={(e) => setEditedHabit({ ...editedHabit, frequency: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500"
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Días específicos si la frecuencia es personalizada */}
          {editedHabit.frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de la semana
              </label>
              <div className="flex justify-between">
                {WEEK_DAYS.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const days = editedHabit.days || [];
                      const newDays = days.includes(day.value)
                        ? days.filter(d => d !== day.value)
                        : [...days, day.value];
                      setEditedHabit({ ...editedHabit, days: newDays });
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      editedHabit.days?.includes(day.value)
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-violet-100'
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora preferida
            </label>
            <select
              value={editedHabit.time ? 'custom' : 'morning'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'custom') {
                  setEditedHabit({ ...editedHabit, time: '08:00' });
                } else {
                  const timeOption = TIME_OPTIONS.find(opt => opt.value === value);
                  setEditedHabit({ ...editedHabit, time: timeOption?.time });
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500"
            >
              {TIME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de hora personalizada */}
          {editedHabit.time && (
            <div className="bg-violet-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-violet-500" />
                <span>Hora específica</span>
              </label>
              <input
                type="time"
                value={editedHabit.time}
                onChange={(e) => setEditedHabit({ ...editedHabit, time: e.target.value })}
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          )}

          {/* Recordatorios */}
          <div className="bg-violet-50 p-4 rounded-xl">
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-violet-500" />
                <div>
                  <span className="font-medium text-gray-900">Recordatorios</span>
                  <p className="text-sm text-gray-600">Notificaciones diarias</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={editedHabit.reminder}
                  onChange={(e) => setEditedHabit({ ...editedHabit, reminder: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${
                  editedHabit.reminder ? 'bg-violet-500' : 'bg-gray-200'
                }`}>
                  <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                    editedHabit.reminder ? 'right-1' : 'left-1'
                  } shadow-sm`} />
                </div>
              </div>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>

        {/* Modal de confirmación de eliminación */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Eliminar hábito?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de selección de icono */}
        <AnimatePresence>
          {showIconPicker && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Seleccionar icono</h4>
                  <button
                    onClick={() => setShowIconPicker(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-4">
                  {ICON_CATEGORIES.map((category) => {
                    const filteredIcons = category.icons.filter(icon =>
                      !iconSearch || icon.toLowerCase().includes(iconSearch.toLowerCase())
                    );

                    if (filteredIcons.length === 0) return null;

                    return (
                      <div key={category.name}>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          {category.name}
                        </h5>
                        <div className="grid grid-cols-6 gap-2">
                          {filteredIcons.map((icon) => (
                            <motion.button
                              key={icon}
                              onClick={() => {
                                setEditedHabit({ ...editedHabit, icon });
                                setShowIconPicker(false);
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                                editedHabit.icon === icon
                                  ? 'bg-violet-500 text-white scale-110 shadow-lg'
                                  : 'hover:bg-violet-50'
                              }`}
                            >
                              {icon}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}