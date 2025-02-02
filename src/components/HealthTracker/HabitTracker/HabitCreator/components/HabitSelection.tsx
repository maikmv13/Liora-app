import React, { useState } from 'react';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { HabitSelectionProps } from '../types';
import { PRESET_HABITS, ICON_CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export function HabitSelection({ 
  selectedCategory, 
  onSelectPreset,
  onCustomHabit,
  onBack,
  customHabit,
  onUpdateCustomHabit,
  showIconPicker,
  setShowIconPicker,
  iconSearch,
  setIconSearch
}: HabitSelectionProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const category = PRESET_HABITS[selectedCategory];

  const handleCustomClick = () => {
    setShowCustomForm(true);
    onCustomHabit();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon}
          </motion.div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">{category.name}</h4>
            <p className="text-sm text-gray-600">Selecciona o crea un hábito</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          ← Cambiar categoría
        </button>
      </div>

      {/* Preset Habits Grid */}
      <div className="grid grid-cols-2 gap-4">
        {category.habits.map((habit) => (
          <motion.button
            key={habit.title}
            onClick={() => onSelectPreset(habit)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden p-4 rounded-xl border-2 border-gray-100 hover:border-amber-200 transition-all bg-white group"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="text-3xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.8, 1]
                  }}
                >
                  {habit.icon}
                </motion.div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">{habit.title}</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </motion.button>
        ))}

        {/* Custom Habit Button */}
        <motion.button
          onClick={handleCustomClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden p-4 rounded-xl border-2 border-dashed transition-all ${
            showCustomForm
              ? 'border-amber-500 bg-amber-50'
              : 'border-amber-200 hover:border-amber-300 bg-amber-50/50'
          }`}
        >
          <div className="relative flex flex-col items-center justify-center space-y-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Plus className="w-6 h-6 text-amber-500" />
            </div>
            <span className="font-medium text-amber-600">
              Crear personalizado
            </span>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
      </div>

      {/* Custom Habit Form */}
      <AnimatePresence>
        {showCustomForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del hábito
                  </label>
                  <input
                    type="text"
                    value={customHabit.title}
                    onChange={(e) => onUpdateCustomHabit({ title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Ej: Meditar, Leer, Ejercicio..."
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icono
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(true)}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-amber-200 hover:border-amber-500 text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{customHabit.icon || '✨'}</span>
                      <span className="text-gray-600">
                        {customHabit.icon ? 'Cambiar icono' : 'Seleccionar icono'}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Picker Modal */}
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

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Buscar icono..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
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
                              onUpdateCustomHabit({ icon });
                              setShowIconPicker(false);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                              customHabit.icon === icon
                                ? 'bg-amber-500 text-white scale-110 shadow-lg'
                                : 'hover:bg-amber-50'
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
    </div>
  );
}