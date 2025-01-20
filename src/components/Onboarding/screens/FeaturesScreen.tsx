import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Apple, Brain, Heart, Sparkles } from 'lucide-react';
import { ScreenProps } from './types';

const features = [
  {
    id: 'nutrition',
    title: 'Nutrición',
    description: 'Consejos personalizados',
    icon: Heart,
    color: 'rose',
    emoji: '🥗'
  },
  {
    id: 'planning',
    title: 'Planificación',
    description: 'Organiza tus comidas',
    icon: Calendar,
    color: 'orange',
    emoji: '📅'
  },
  {
    id: 'recipes',
    title: 'Recetas',
    description: 'Platos saludables',
    icon: Apple,
    color: 'emerald',
    emoji: '👩‍🍳'
  },
  {
    id: 'ai',
    title: 'Asistente IA',
    description: 'Ayuda 24/7',
    icon: Brain,
    color: 'purple',
    emoji: '🤖'
  }
];

export function FeaturesScreen({ onNext }: ScreenProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Mostrar el botón después de que se muestren las características
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1200); // Ajusta este tiempo según necesites

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-8 md:py-12 max-w-lg mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500" />
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
              className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                Descubre Liora ✨
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-2">
              Aprende a cómo vivir estable en una balanza!
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`
                bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-${feature.color}-100
                shadow-sm transform transition-all duration-300 hover:scale-105 active:scale-95
                cursor-pointer relative overflow-hidden group
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-rose-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`p-3 rounded-xl bg-${feature.color}-50 mb-3`}>
                  <feature.icon size={20} className={`text-${feature.color}-500`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {feature.title} {feature.emoji}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="fixed bottom-8 left-4 right-4 md:left-auto md:right-auto md:w-full max-w-sm mx-auto"
          >
            <button
              onClick={onNext}
              className="w-full px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
            >
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}