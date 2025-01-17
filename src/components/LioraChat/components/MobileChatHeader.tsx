import React from 'react';
import { ArrowLeft, Bot, Sparkles, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function MobileChatHeader() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-rose-500 to-pink-500"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-white/10 p-2 rounded-xl">
                <Bot size={20} className="text-white" />
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
                className="absolute -top-1 -right-1 bg-white/20 rounded-full p-1"
              >
                <Sparkles size={8} className="text-white" />
              </motion.div>
            </div>
            
            <div>
              <h1 className="font-semibold text-white">Liora AI</h1>
              <div className="flex items-center space-x-1.5">
                <Circle size={6} className="fill-green-400 text-green-400" />
                <p className="text-xs text-white/90">En línea</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}