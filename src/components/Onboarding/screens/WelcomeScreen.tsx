import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { ScreenProps } from './types';
import { FallingEmojis } from '../../LioraChat/components/FallingEmojis';
import { ChatMessage } from '../../LioraChat/components/ChatMessage';

// Initial welcome message
const welcomeMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: `¡Hola! 👋 Soy Liora, tu asistente nutricional personal.

Estoy aquí para ayudarte a encontrar el equilibrio perfecto en tu alimentación, con consejos personalizados y recetas saludables.`,
  timestamp: new Date().toISOString()
};

// Follow-up message
const followUpMessage = {
  id: 'welcome-2',
  role: 'assistant',
  content: `¿Comenzamos este viaje juntos hacia una vida más saludable? 🌱✨`,
  timestamp: new Date(Date.now() + 1000).toISOString()
};

export function WelcomeScreen({ onNext }: ScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-rose-500/5 overflow-hidden">
      {/* SVG Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeOpacity="0.2"></path>
            </pattern>
            <pattern id="circles" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="currentColor" fillOpacity="0.2"/>
              <circle cx="36" cy="36" r="1" fill="currentColor" fillOpacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"></rect>
          <rect width="100%" height="100%" fill="url(#circles)"></rect>
        </svg>
      </div>

      <FallingEmojis />
      
      <div className="relative h-full flex flex-col items-center px-4 pt-8 md:pt-12 pb-24 md:pb-20 max-w-lg mx-auto z-10">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6 md:mb-8"
        >
          <div className="bg-white/30 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-xl">
            <Bot size={40} className="text-rose-500" />
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
              className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1.5 md:p-2"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <div className="text-center mb-6 md:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-transparent bg-clip-text">
              LIORA
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mt-2"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 font-light">
              Life in Balance
            </span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -right-4 md:-right-6 top-0"
            >
              <span className="text-xl md:text-2xl">✨</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Welcome Messages */}
        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ChatMessage message={welcomeMessage} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ChatMessage message={followUpMessage} />
          </motion.div>
        </div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          onClick={onNext}
          className="fixed bottom-8 left-4 right-4 md:relative md:mt-8 md:w-full px-6 md:px-8 py-4 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 max-w-sm mx-auto"
        >
          Comenzar mi viaje
        </motion.button>
      </div>
    </div>
  );
}