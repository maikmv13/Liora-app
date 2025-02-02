import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Calendar, ShoppingCart, Activity, Menu, X, ArrowLeft, Heart, Scale, Dumbbell, CheckSquare, Bot } from 'lucide-react';
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
  { id: 'liora', icon: Bot, label: 'Liora AI', color: 'from-indigo-400 to-violet-500' },
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
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export function Navigation({ activeTab, onTabChange, onHealthTabChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determinar si estamos en la sección de salud y qué subsección
  const isHealthSection = location.pathname === '/salud';
  const healthTab = location.hash.slice(1) || 'health';

  // Mover el useEffect aquí, antes de cualquier return
  useEffect(() => {
    if (isHealthSection && onHealthTabChange) {
      onHealthTabChange(healthTab);
    }
  }, [healthTab, isHealthSection, onHealthTabChange]);

  // No mostrar en páginas de recetas individuales
  if (location.pathname.startsWith('/recipe/')) return null;

  const handleTabChange = (id: string) => {
    onTabChange(id);
    navigate(`/${id}`);
    setIsOpen(false);
  };

  // Obtener el icono y color correctos para el botón flotante
  const getCurrentIconAndColor = () => {
    if (isHealthSection) {
      const currentHealthItem = HEALTH_SUBMENU.find(item => item.id === healthTab);
      return {
        Icon: currentHealthItem?.icon || Activity,
        color: currentHealthItem?.color || MENU_ITEMS[4].color
      };
    }
    const currentMenuItem = MENU_ITEMS.find(item => item.id === activeTab);
    return {
      Icon: isOpen ? X : (currentMenuItem?.icon || Menu),
      color: currentMenuItem?.color || MENU_ITEMS[0].color
    };
  };

  const { Icon, color } = getCurrentIconAndColor();

  return (
    <>
      {/* Mobile Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50">
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

        {/* Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-2xl bg-white/90 backdrop-blur-lg border border-white/30 relative overflow-hidden group`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05)
            `
          }}
        >
          {/* Efecto de ping */}
          <div className="absolute inset-0 rounded-2xl animate-ping bg-white/20" />
          
          {/* Brillo rotatorio */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-transparent animate-[spin_2s_linear_infinite]" />
          
          {/* Icono */}
          <div className={`relative z-10 bg-gradient-to-br ${color} rounded-xl p-2`}>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          
          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

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
      </div>
    </>
  );
}