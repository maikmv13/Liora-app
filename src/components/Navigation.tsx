import React, { useState, useEffect } from 'react';
import { ChefHat, Calendar, ShoppingCart, Heart } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { 
      id: 'recetas', 
      icon: ChefHat, 
      label: 'Recetas',
      description: 'Explora recetas'
    },
    { 
      id: 'menu', 
      icon: Calendar, 
      label: 'Menú',
      description: 'Planifica tu semana'
    },
    { 
      id: 'compra', 
      icon: ShoppingCart, 
      label: 'Compra',
      description: 'Lista de la compra'
    },
    { 
      id: 'favoritos', 
      icon: Heart, 
      label: 'Favoritos',
      description: 'Tus recetas favoritas'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`bg-white/80 backdrop-blur-md shadow-sm sticky z-40 border-b border-rose-100/20 transition-all duration-200 ${
      isVisible ? 'top-[49px] md:top-[72px]' : '-top-20'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex">
          {navItems.map(({ id, icon: Icon, label, description }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`group flex-1 py-2 md:py-4 transition-all duration-200 relative ${
                activeTab === id
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-rose-400'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-0.5 md:space-y-1">
                <div className={`p-1.5 md:p-2 rounded-xl transition-all duration-300 ${
                  activeTab === id 
                    ? 'bg-rose-50' 
                    : 'group-hover:bg-rose-50/50'
                }`}>
                  <Icon 
                    size={18} 
                    className={`transition-all duration-300 ${
                      activeTab === id 
                        ? 'transform scale-110' 
                        : 'group-hover:scale-110'
                    }`} 
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-xs">{label}</span>
                  <span className="hidden md:block text-xs text-gray-400 group-hover:text-rose-400 transition-colors">
                    {description}
                  </span>
                </div>
              </div>
              {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}