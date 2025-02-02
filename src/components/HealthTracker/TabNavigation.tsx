import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Verificar si necesitamos mostrar las flechas de navegación
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Observar cambios en el scroll
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      // Verificación inicial
      checkScrollButtons();
      
      // Centrar la pestaña activa
      const activeElement = scrollElement.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement as HTMLElement;
        const scrollLeft = offsetLeft - (scrollElement.clientWidth - offsetWidth) / 2;
        scrollElement.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [activeTab]);

  // Manejar scroll horizontal
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-4">
      {/* Flechas de navegación */}
      {showLeftArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
      
      {showRightArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Contenedor de pestañas con scroll */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="flex space-x-2 px-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 min-w-[140px] ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
                    : 'hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`relative z-10 flex items-center space-x-2 ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive ? 'text-white' : ''
                  }`}>
                    {tab.label}
                  </span>
                </div>

                {/* Indicador de pestaña activa */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}