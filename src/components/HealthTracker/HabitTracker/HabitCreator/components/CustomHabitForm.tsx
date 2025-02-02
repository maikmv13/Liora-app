import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import { ICON_CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomHabitFormProps {
  customHabit: {
    title: string;
    icon: string;
  };
  onUpdateCustomHabit: (updates: Partial<{ title: string; icon: string }>) => void;
  onNext: () => void;
  onBack: () => void;
  showIconPicker: boolean;
  setShowIconPicker: (show: boolean) => void;
  iconSearch: string;
  setIconSearch: (search: string) => void;
}

export function CustomHabitForm({
  customHabit,
  onUpdateCustomHabit,
  onNext,
  onBack,
  showIconPicker,
  setShowIconPicker,
  iconSearch,
  setIconSearch
}: CustomHabitFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHabit.title && customHabit.icon) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: customHabit.icon ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <span className="text-3xl">{customHabit.icon || '✨'}</span>
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900">
          Personaliza tu hábito
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Dale un nombre y un icono a tu nuevo hábito
        </p>
      </div>

      <div className="space-y-4">
        {/* Nombre del hábito */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del hábito
          </label>
          <input
            type="text"
            value={customHabit.title}
            onChange={(e) => onUpdateCustomHabit({ title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="Ej: Meditar, Leer, Ejercicio..."
            required
          />
        </div>

        {/* Selector de icono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icono
          </label>
          <button
            type="button"
            onClick={() => setShowIconPicker(true)}
            className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-left flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{customHabit.icon || '✨'}</span>
              <span className="text-gray-600">
                {customHabit.icon ? 'Cambiar icono' : 'Seleccionar icono'}
              </span>
            </div>
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

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
                  type="button"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
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
                            type="button"
                            onClick={() => {
                              onUpdateCustomHabit({ icon });
                              setShowIconPicker(false);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                              customHabit.icon === icon
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

      {/* Botones de navegación */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={!customHabit.title || !customHabit.icon}
          className="flex-1 py-2.5 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}