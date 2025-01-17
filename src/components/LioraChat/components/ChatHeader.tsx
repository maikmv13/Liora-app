import React from 'react';
import { Bot, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function ChatHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center space-x-4 p-6 border-b border-rose-100/20 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-200/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Logo and title */}
      <div className="relative flex items-center justify-center">
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-rose-100">
            <Bot size={28} className="text-rose-500" />
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
            className="absolute -top-1 -right-1 bg-rose-100 rounded-full p-1"
          >
            <Sparkles size={12} className="text-rose-500" />
          </motion.div>
        </div>
      </div>

      <div className="relative flex-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
          Liora AI
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <Brain size={14} className="text-rose-400" />
          <span className="text-sm text-gray-600">Asistente nutricional inteligente</span>
        </div>
      </div>
    </motion.div>
  );
}