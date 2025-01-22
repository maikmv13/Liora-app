import React from 'react';
import { AlertCircle, X, Heart, Sparkles, Leaf, Brain, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export function MenuErrorNotification({ message, onClose }: MenuErrorNotificationProps) {
  const benefits = [
    { icon: Heart, text: 'Mayor variedad de platos', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: Leaf, text: 'Mejor balance nutricional', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Brain, text: 'Menús más personalizados', color: 'text-violet-500', bg: 'bg-violet-50' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed inset-x-4 top-4 md:inset-auto md:top-4 md:right-4 z-50 md:max-w-md w-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-rose-400 to-red-500 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-1 -right-1 bg-white rounded-full p-1"
                >
                  <Sparkles size={8} className="text-amber-500" />
                </motion.div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Necesitas más recetas favoritas</h4>
                <p className="text-sm text-gray-600">Para un menú más completo y variado</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 flex items-center space-x-1">
              <Sparkles size={14} className="text-amber-400" />
              <span>Beneficios de tener más recetas favoritas:</span>
            </p>
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center justify-between p-2 rounded-xl
                  ${benefit.bg} group hover:ring-2 hover:ring-offset-2 hover:ring-${benefit.color}
                  transition-all duration-200 cursor-pointer
                `}
              >
                <div className="flex items-center space-x-2">
                  <benefit.icon size={16} className={benefit.color} />
                  <span className="text-sm text-gray-700">{benefit.text}</span>
                </div>
                <ChevronRight size={16} className={`${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onClose();
              // Navegar a la sección de recetas
              window.location.href = '/recetas';
            }}
            className="w-full mt-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 
                     text-white rounded-xl font-medium shadow-md hover:shadow-lg 
                     transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Explorar recetas</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}