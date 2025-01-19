import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // No mostrar el botón si estamos en la página de chat o en recipe details
  if (location.pathname === '/liora' || location.pathname.startsWith('/recipe/')) {
    return null;
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/liora')}
      className="fixed bottom-24 right-6 md:bottom-6 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-colors z-50 group drop-shadow-[0_4px_8px_rgba(244,63,94,0.25)]"
      aria-label="Abrir chat con Liora"
    >
      <div className="relative">
        <Bot size={24} />
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
          className="absolute -top-5 -right-5 bg-white rounded-full p-1.5 shadow-md"
        >
          <Sparkles size={8} className="text-rose-500" />
        </motion.div>
      </div>
      
      {/* Tooltip - Solo visible en desktop */}
      <span className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
        Chatea con Liora
      </span>
    </motion.button>
  );
}