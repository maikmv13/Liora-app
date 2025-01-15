import React from 'react';
import { 
  X, ChefHat, Calendar, ShoppingCart, Activity, User, 
  LogIn, Settings, LogOut, Apple, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: () => void;
  onProfile: () => void;
  activeTab: string;
}

export function MobileMenu({ isOpen, onClose, user, onLogin, onProfile, activeTab }: MobileMenuProps) {
  const navigate = useNavigate();

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
      icon: ChefHat, 
      label: 'Recetas',
      onClick: () => navigate('/recetas')
    },
    { 
      id: 'menu', 
      icon: Calendar, 
      label: 'Menú',
      onClick: () => navigate('/menu')
    },
    { 
      id: 'compra', 
      icon: ShoppingCart, 
      label: 'Lista de Compra',
      onClick: () => navigate('/compra')
    }
  ];

  const additionalItems = [
    {
      id: 'vida-sana',
      icon: Apple,
      label: 'Vida Sana',
      onClick: () => navigate('/vida-sana'),
      description: 'Consejos y bienestar'
    },
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
      <div className={`
        fixed inset-y-0 right-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <ChefHat size={20} />
              </div>
              <span className="font-medium">MiCocina</span>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Menu Items */}
          <div className="py-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-rose-500' : 'text-gray-500'} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

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
                  activeTab === item.id
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-700 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === item.id 
                      ? 'bg-rose-100' 
                      : 'bg-gray-50'
                  }`}>
                    <item.icon size={18} className={
                      activeTab === item.id ? 'text-rose-500' : 'text-gray-500'
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
    </>
  );
}