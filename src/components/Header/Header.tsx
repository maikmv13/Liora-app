import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChefHat, Search, User, Heart, Scale, Dumbbell, CheckSquare, Activity,
  ArrowLeft, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  user?: User | null;
  onLogin?: () => void;
  onProfile?: () => void;
}

const HEALTH_TABS = [
  { id: 'health', icon: Activity, label: 'Salud', gradient: 'from-violet-400 to-fuchsia-500' },
  { id: 'weight', icon: Scale, label: 'Peso', gradient: 'from-rose-400 to-orange-500' },
  { id: 'exercise', icon: Dumbbell, label: 'Ejercicio', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'habits', icon: CheckSquare, label: 'Hábitos', gradient: 'from-amber-400 to-orange-500' }
];

const ROUTE_STYLES = {
  'recetas': { gradient: 'from-orange-400 to-rose-500' },
  'menu': { gradient: 'from-rose-400 to-pink-500' },
  'compra': { gradient: 'from-pink-400 to-purple-500' },
  'salud': { gradient: 'from-purple-400 to-violet-500' }
};

export function Header({ activeTab, onTabChange, onSearch, searchTerm, user, onLogin, onProfile }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determinar si estamos en la sección de salud y qué subsección
  const isHealthSection = location.pathname === '/salud';
  const isRecipeDetail = location.pathname.startsWith('/recipe/');
  const healthTab = location.hash.slice(1) || 'health';

  // Función para manejar el regreso
  const handleBack = () => {
    navigate(-1); // Esto nos llevará a la página anterior
  };

  // Obtener el estilo correcto basado en la ruta o pestaña de salud
  const getStyle = () => {
    if (isHealthSection) {
      const currentHealthTab = HEALTH_TABS.find(tab => tab.id === healthTab);
      return {
        gradient: currentHealthTab?.gradient || HEALTH_TABS[0].gradient
      };
    }
    return ROUTE_STYLES[activeTab as keyof typeof ROUTE_STYLES] || ROUTE_STYLES.recetas;
  };

  const { gradient } = getStyle();

  // Función para obtener el título basado en activeTab
  const getTitle = () => {
    if (isHealthSection) {
      return HEALTH_TABS.find(tab => tab.id === healthTab)?.label;
    }
    
    switch (activeTab) {
      case 'menu':
        return 'Menú';
      case 'compra':
        return 'Lista de Compra';
      case 'favoritos':
        return 'Favoritos';
      case 'recetas':
      default:
        return 'Recetas';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="px-4 py-2">
        <motion.div 
          className="mx-auto max-w-7xl bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3))',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}
        >
          <div className="px-4">
            <div className="flex items-center justify-between h-14">
              {/* Logo y Título */}
              <div className="flex items-center space-x-3">
                {isHealthSection || isRecipeDetail ? (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </button>
                ) : (
                  <motion.div 
                    className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChefHat className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                <div className="flex flex-col">
                  <motion.h1 
                    className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {isRecipeDetail ? 'Receta' : getTitle()}
                  </motion.h1>
                  {isHealthSection && (
                    <motion.div 
                      className="flex items-center space-x-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span className="text-xs text-violet-500">Progreso diario</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center space-x-2">
                {!isHealthSection && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Search className="w-6 h-6 text-gray-600" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/favoritos')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Heart className="w-6 h-6 text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <User className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Barra de búsqueda expandible */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pb-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  );
}