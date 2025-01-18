import React, { useState } from 'react';
import { Bot, Sparkles, Heart, Calendar, Apple, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeMessageProps {
  welcomeIndex: number;
  isMobile?: boolean;
  onSelectQuery?: (query: string) => void;
}

const WELCOME_FEATURES = [
  {
    icon: Heart,
    title: "Nutrición Personalizada",
    description: "Consejos adaptados a tus necesidades y objetivos",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    delay: 1.5,
    queries: [
      "¿Cuántas calorías debería consumir al día?",
      "¿Qué alimentos me ayudan a ganar masa muscular?",
      "¿Cómo puedo mejorar mi digestión?",
      "¿Qué alimentos debo evitar para perder peso?"
    ]
  },
  {
    icon: Calendar,
    title: "Planificación de Menús",
    description: "Organiza tus comidas de forma saludable y equilibrada",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    delay: 1.8,
    queries: [
      "¿Puedes sugerirme un menú semanal equilibrado?",
      "¿Qué puedo cocinar hoy con pollo?",
      "Necesito ideas para cenas ligeras",
      "¿Qué desayunos saludables me recomiendas?"
    ]
  },
  {
    icon: Apple,
    title: "Recetas Saludables",
    description: "Descubre platos nutritivos y deliciosos",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    delay: 2.1,
    queries: [
      "¿Tienes alguna receta vegetariana fácil?",
      "¿Cómo preparar un batido proteico casero?",
      "Necesito recetas sin gluten",
      "¿Qué postres saludables me recomiendas?"
    ]
  },
  {
    icon: Brain,
    title: "Consejos y Tips",
    description: "Aprende sobre alimentación y bienestar",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    delay: 2.4,
    queries: [
      "¿Cómo mantener buenos hábitos alimenticios?",
      "Tips para hacer la compra de forma saludable",
      "¿Cómo leer correctamente las etiquetas nutricionales?",
      "Consejos para comer sano fuera de casa"
    ]
  }
];

export function WelcomeMessage({ welcomeIndex, isMobile = false, onSelectQuery }: WelcomeMessageProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const handleQueryClick = (query: string) => {
    if (onSelectQuery) {
      onSelectQuery(query);
      setExpandedSection(null);
    }
  };

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
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Feature Header */}
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full p-4 flex items-start justify-between space-x-3 hover:bg-gray-50 transition-colors rounded-t-xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <feature.icon size={18} className={feature.color} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                  <div className={`mt-1 transition-transform duration-200 ${
                    expandedSection === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </button>

                {/* Expandable Queries Section */}
                <AnimatePresence>
                  {expandedSection === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="p-4 space-y-2">
                        {feature.queries.map((query, qIndex) => (
                          <motion.button
                            key={qIndex}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: qIndex * 0.1 }}
                            onClick={() => handleQueryClick(query)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left group transition-colors"
                          >
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                              {query}
                            </span>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}