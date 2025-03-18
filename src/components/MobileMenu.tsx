import React from 'react';
import { 
  X, ChefHat, Calendar, ShoppingCart, User, 
  LogIn, Settings, LogOut, Apple, Heart, Bot, CalendarDays
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PWAInstallButton } from './PWAInstallButton';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: () => void;
  onProfile: () => void;
  activeTab: string;
}

export function MobileMenu({ isOpen, onClose, user, onLogin, onProfile, activeTab }: MobileMenuProps) {
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/menu');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
      onClick: () => navigate('/favoritos'),
      requiresAuth: true
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
        onProfile();
        navigate('/profile');
      },
      description: 'Gestiona tu cuenta'
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
        className={`
          fixed inset-y-0 right-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
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
              >
                <div className="w-5 h-5 relative">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 rotate-45"></span>
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 -rotate-45"></span>
                </div>
              </button>
            </div>
          </div>

          {/* User Section */}
          {user ? (
            <button
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="w-full p-4 border-b border-gray-100 text-left hover:bg-rose-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-3 rounded-xl">
                  <User size={24} className="text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => {
                  onLogin();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl"
              >
                <LogIn size={20} />
                <span>Iniciar sesión</span>
              </button>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              if (item.requiresAuth && !user) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-colors duration-200
                    ${currentTab === item.id 
                      ? 'bg-rose-500 text-white' 
                      : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
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
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                  currentTab === item.id
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentTab === item.id 
                      ? 'bg-rose-100' 
                      : 'bg-gray-50'
                  }`}>
                    <item.icon size={18} className={
                      currentTab === item.id ? 'text-rose-500' : 'text-gray-500'
                    } />
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

          {/* Footer Actions */}
          {user && (
            <div className="flex-shrink-0 p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}