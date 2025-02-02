import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Calendar, ShoppingCart, Activity, Menu, X, ArrowLeft, Heart, Scale, Dumbbell, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onHealthTabChange?: (tab: string) => void;
}

const MENU_ITEMS = [
  { id: 'recetas', icon: ChefHat, label: 'Recetas', color: 'from-orange-400 to-rose-500' },
  { id: 'menu', icon: Calendar, label: 'Menú', color: 'from-rose-400 to-pink-500' },
  { id: 'compra', icon: ShoppingCart, label: 'Compra', color: 'from-pink-400 to-purple-500' },
  { id: 'salud', icon: Activity, label: 'Objetivos', color: 'from-purple-400 to-violet-500' }
];

const HEALTH_SUBMENU = [
  { id: 'health', icon: Heart, label: 'Salud', color: 'from-violet-400 to-fuchsia-500' },
  { id: 'weight', icon: Scale, label: 'Peso', color: 'from-rose-400 to-orange-500' },
  { id: 'exercise', icon: Dumbbell, label: 'Ejercicio', color: 'from-emerald-400 to-teal-500' },
  { id: 'habits', icon: CheckSquare, label: 'Hábitos', color: 'from-amber-400 to-orange-500' }
];

// Animation variants for menu items
const menuVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  },
  open: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.05
    }
  })
};

export function Navigation({ activeTab, onTabChange, onHealthTabChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // No mostrar en páginas de recetas individuales
  if (location.pathname.startsWith('/recipe/')) return null;

  const handleTabChange = (id: string) => {
    onTabChange(id);
    navigate(`/${id}`);
    setIsOpen(false);
  };

  // Determinar si estamos en la sección de salud y qué subsección
  const isHealthSection = location.pathname === '/salud';
  const healthTab = location.hash.slice(1) || 'health';

  // Obtener el icono y color correctos para el botón flotante
  const getCurrentIconAndColor = () => {
    if (isHealthSection) {
      const currentHealthItem = HEALTH_SUBMENU.find(item => item.id === healthTab);
      return {
        Icon: currentHealthItem?.icon || Activity,
        color: currentHealthItem?.color || MENU_ITEMS[3].color
      };
    }
    const currentMenuItem = MENU_ITEMS.find(item => item.id === activeTab);
    return {
      Icon: isOpen ? X : (currentMenuItem?.icon || Menu),
      color: currentMenuItem?.color || MENU_ITEMS[0].color
    };
  };

  const { Icon, color } = getCurrentIconAndColor();

  // Manejar cambios en el hash para actualizar el tab de salud
  useEffect(() => {
    if (isHealthSection && onHealthTabChange) {
      onHealthTabChange(healthTab);
    }
  }, [healthTab, isHealthSection, onHealthTabChange]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {MENU_ITEMS.map(({ id, icon: Icon, label, color }) => (
              <motion.button
                key={id}
                onClick={() => handleTabChange(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative py-4 px-6 transition-all duration-200 ${
                  activeTab === id
                    ? 'text-rose-500'
                    : 'text-gray-600 hover:text-rose-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    activeTab === id 
                      ? 'bg-rose-50' 
                      : 'group-hover:bg-rose-50/50'
                  }`}>
                    <Icon 
                      size={20} 
                      className={`transition-all duration-300 ${
                        activeTab === id 
                          ? 'transform scale-110' 
                          : 'group-hover:scale-110'
                      }`} 
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{label}</span>
                  </div>
                </div>

                {activeTab === id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Navigation */}
      <div className="fixed md:hidden bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-full right-0 mb-4 space-y-2">
              {(isHealthSection ? HEALTH_SUBMENU : MENU_ITEMS).map((item, index) => (
                <motion.button
                  key={item.id}
                  custom={MENU_ITEMS.length - 1 - index}
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  onClick={() => {
                    if (isHealthSection) {
                      navigate(`/salud#${item.id}`);
                      if (onHealthTabChange) {
                        onHealthTabChange(item.id);
                      }
                    } else {
                      handleTabChange(item.id);
                    }
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-lg min-w-[160px] hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </motion.button>
              ))}

              {/* Back button for health section */}
              {isHealthSection && (
                <motion.button
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  onClick={() => {
                    navigate('/recetas');
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-lg min-w-[160px] hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                    <ArrowLeft size={20} />
                  </div>
                  <span className="font-medium text-gray-900">Volver</span>
                </motion.button>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-4 rounded-full bg-gradient-to-r ${color} text-white shadow-lg`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon size={24} />
          </motion.div>

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
          
          {/* Rotating glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 via-transparent to-transparent animate-[spin_2s_linear_infinite]" />
        </motion.button>
      </div>
    </>
  );
}