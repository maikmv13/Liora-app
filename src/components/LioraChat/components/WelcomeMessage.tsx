import React from 'react';
import { Bot, Sparkles, Heart, Calendar, Apple, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeMessageProps {
  welcomeIndex: number;
  isMobile?: boolean;
}

const WELCOME_FEATURES = [
  {
    icon: Heart,
    title: "Nutrición Personalizada",
    description: "Consejos adaptados a tus necesidades y objetivos",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    delay: 1.5
  },
  {
    icon: Calendar,
    title: "Planificación de Menús",
    description: "Organiza tus comidas de forma saludable y equilibrada",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    delay: 1.8
  },
  {
    icon: Apple,
    title: "Recetas Saludables",
    description: "Descubre platos nutritivos y deliciosos",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    delay: 2.1
  },
  {
    icon: Brain,
    title: "Consejos y Tips",
    description: "Aprende sobre alimentación y bienestar",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    delay: 2.4
  }
];

export function WelcomeMessage({ welcomeIndex, isMobile = false }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-100 overflow-hidden ${
        isMobile ? 'mx-4' : ''
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-rose-100/20 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-rose-100">
              <Bot size={24} className="text-rose-500" />
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
              className="absolute -top-1 -right-1 bg-rose-100 rounded-full p-1.5"
            >
              <Sparkles size={10} className="text-rose-500" />
            </motion.div>
          </div>
          
          <div>
            <AnimatePresence mode="wait">
              {welcomeIndex >= 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <h2 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                      Liora
                    </span>
                  </h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-1 -right-1 bg-rose-100 rounded-full p-1"
                  >
                    <Sparkles size={8} className="text-rose-500" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {welcomeIndex >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 mt-2"
                >
                  ¡Hola! 👋 Soy tu asistente nutricional personal
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`p-6 grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <AnimatePresence mode="wait">
          {welcomeIndex >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-600 col-span-full"
            >
              Estoy aquí para ayudarte con:
            </motion.p>
          )}
        </AnimatePresence>

        {WELCOME_FEATURES.map((feature, index) => (
          <AnimatePresence key={feature.title} mode="wait">
            {welcomeIndex >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <feature.icon size={18} className={feature.color} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}