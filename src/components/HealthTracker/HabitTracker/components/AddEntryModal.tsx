import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelector } from './DateSelector';
import type { DailyEntry } from '../types';

interface AddEntryModalProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  existingEntries: DailyEntry[];
}

export function AddEntryModal({
  selectedDate,
  onDateChange,
  onClose,
  onSubmit,
  existingEntries
}: AddEntryModalProps) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    onSubmit();
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Entrada creada!
              </h3>
              <p className="text-gray-600">
                Redirigiendo a la entrada...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Nueva entrada</h3>
                  <p className="text-sm text-gray-500">Selecciona la fecha y hora</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <DateSelector
                selectedDate={selectedDate}
                onChange={onDateChange}
                existingEntries={existingEntries}
              />

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Crear entrada
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}