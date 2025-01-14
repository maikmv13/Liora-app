import React, { useState } from 'react';
import { ChefHat, Search, Menu, X, Download, Share2, LogIn, Apple, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountMenu } from './AccountMenu';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogin: () => void;
  user: any;
  onProfile: () => void;
}

export function Header({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange,
  onLogin,
  user,
  onProfile
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <ChefHat size={20} className="text-white transform group-hover:rotate-12 transition-transform" />
            </div>
            <h1 className="text-lg md:text-xl tracking-tight text-white">
              <span className="font-light">Mi</span>
              <span className="font-bold">Cocina</span>
            </h1>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {activeTab !== 'salud' && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <Search size={20} />
              </button>
            )}

            {/* Botón de Vida Sana - Solo en desktop */}
            <button
              onClick={() => onTabChange('plato')}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              <Apple size={18} />
              <span className="text-sm font-medium">Vida Sana</span>
            </button>

            {/* Botón de perfil/login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  <User size={18} />
                  <span className="text-sm font-medium hidden md:block">Mi Cuenta</span>
                </button>

                <AccountMenu
                  isOpen={showAccountMenu}
                  onClose={() => setShowAccountMenu(false)}
                  userType={user.user_metadata?.user_type || 'user'}
                  userName={user.user_metadata?.full_name || 'Usuario'}
                />
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium hidden md:block">Iniciar sesión</span>
              </button>
            )}

            {/* Botón de menú móvil */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Rest of the header components... */}
    </header>
  );
}