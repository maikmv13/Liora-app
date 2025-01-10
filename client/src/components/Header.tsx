import React, { useState, useEffect } from 'react';
import { ChefHat, Search, Menu, X, Download, Share2, LogIn, Apple, User } from 'lucide-react';
import { Navigation } from './Navigation';

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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg shadow-inner border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <ChefHat size={20} className="text-white transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h1 className="text-lg md:text-xl tracking-tight">
              <span className="font-light">Mi</span>
              <span className="font-bold">Cocina</span>
            </h1>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-2">
            {activeTab !== 'peso' && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search size={20} className="text-white" />
              </button>
            )}
            <button
              onClick={() => onTabChange('plato')}
              className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <Apple size={18} />
              <span className="text-sm font-medium">Vida Sana</span>
            </button>
            {user ? (
              <button
                onClick={onProfile}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <User size={18} />
                <span className="text-sm font-medium">Mi Cuenta</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium">Iniciar sesión</span>
              </button>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda expandible */}
      {showSearch && (
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar recetas, ingredientes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-lg text-gray-800 bg-white/90 backdrop-blur-md border border-white/20 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menú móvil */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-white/10">
          <div className="container mx-auto px-4 py-2">
            <Navigation
              activeTab={activeTab}
              onTabChange={(tab) => {
                onTabChange(tab);
                setShowMobileMenu(false);
              }}
              orientation="vertical"
            />
            {!user && (
              <button
                onClick={() => {
                  onLogin();
                  setShowMobileMenu(false);
                }}
                className="w-full mt-2 flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium">Iniciar sesión</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}