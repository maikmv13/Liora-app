import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChefHat, ShoppingCart, User,
  Heart, CalendarDays
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

export function MobileMenu({ isOpen, onClose, activeTab }: MobileMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Función helper para obtener la pestaña activa
  const getActiveTab = () => {
    const path = location.pathname;

    switch (path) {
      case '/recetas':
        return 'recetas';
      case '/favoritos':
        return 'favoritos';
      case '/menu':
        return 'menu';
      case '/compra':
        return 'compra';
      case '/profile':
        return 'profile';
      case path.match(/^\/recipe\//)?.input:
        return 'recetas';
      default:
        return activeTab;
    }
  };

  const currentTab = getActiveTab();

  const menuItems = [
    {
      id: 'recetas',
      label: 'Recetas',
      icon: <ChefHat size={20} />,
      onClick: () => navigate('/recetas')
    },
    {
      id: 'favoritos',
      label: 'Mis Recetas',
      icon: <Heart size={20} />,
      onClick: () => navigate('/favoritos')
    },
    {
      id: 'menu',
      label: 'Menú Semanal',
      icon: <CalendarDays size={20} />,
      onClick: () => navigate('/menu')
    },
    {
      id: 'compra',
      label: 'Lista de Compra',
      icon: <ShoppingCart size={20} />,
      onClick: () => navigate('/compra')
    }
  ];

  const additionalItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Mi Perfil',
      onClick: () => {
        navigate('/profile');
      },
      description: 'Vista previa del perfil'
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <ChefHat size={20} />
                </div>
                <span className="font-medium">Liora</span>
              </div>
              <button
                onClick={onClose}
                className="relative group p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Cerrar menú"
              >
                <div className="w-5 h-5 relative">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 -rotate-45"></span>
                </div>
              </button>
            </div>
          </div>

          {/* User Section - Mode Showcase */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3 text-rose-500 font-medium text-sm bg-rose-50 p-3 rounded-xl">
              <ChefHat size={16} />
              <span>Modo Showcase</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${currentTab === item.id ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Additional Menu Items */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            {additionalItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${currentTab === item.id ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:bg-rose-50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${currentTab === item.id ? 'bg-rose-100' : 'bg-gray-50'}`}>
                    <item.icon size={18} className={currentTab === item.id ? 'text-rose-500' : 'text-gray-500'} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* PWA Install Button */}
            <PWAInstallButton onInstall={onClose} />
          </div>

          <div className="p-4 border-t border-gray-50 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-semibold">Proyecto de visualización</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}