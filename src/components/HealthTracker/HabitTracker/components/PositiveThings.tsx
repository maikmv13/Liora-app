import React, { useState } from 'react';
import { Info, Save, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PositiveThingsProps {
  entries: string[];
  onSave: (entries: string[]) => void;
  disabled?: boolean;
}

export function PositiveThings({ entries = ['', '', ''], onSave, disabled = false }: PositiveThingsProps) {
  const [things, setThings] = useState<string[]>(entries);
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onSave(things);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasEntries = things.some(thing => thing.trim().length > 0);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 border-b border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-white">Tres Cosas Positivas</h3>
            {hasEntries && (
              <p className="text-xs text-amber-200 mt-0.5">
                {things.filter(t => t.trim().length > 0).length} registradas hoy
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(true);
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
          >
            <Info className="w-5 h-5" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/80" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/80" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {things.map((thing, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <input
                    type="text"
                    value={thing}
                    onChange={(e) => {
                      const newThings = [...things];
                      newThings[index] = e.target.value;
                      setThings(newThings);
                    }}
                    placeholder={`${index + 1}ª cosa buena...`}
                    disabled={disabled}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 focus:border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  />
                </motion.div>
              ))}

              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                disabled={disabled || things.every(t => !t.trim())}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center space-x-2 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saved ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>¡Guardado!</span>
                  </motion.div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Info className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Sobre las Tres Cosas Positivas
                  </h4>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Registrar tres cosas positivas cada día entrena tu cerebro para identificar lo bueno en tu vida. Esta práctica, respaldada por la psicología positiva, ayuda a reprogramar tu perspectiva y 'cambiar la banda sonora de tu vida' hacia una más optimista y gratificante.
                </p>

                <div className="bg-amber-50 rounded-xl p-4">
                  <h5 className="font-medium text-amber-800 mb-2">Beneficios:</h5>
                  <ul className="space-y-2 text-amber-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-amber-500">•</span>
                      <span>Mejora el estado de ánimo</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-amber-500">•</span>
                      <span>Aumenta la gratitud</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-amber-500">•</span>
                      <span>Reduce el estrés</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}