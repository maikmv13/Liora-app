import React, { useState, useEffect } from 'react';
import { ChefHat, Search, Menu, X, Download, Share2, LogIn, Apple } from 'lucide-react';
import { Navigation } from './Navigation';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ searchTerm, onSearchChange, activeTab, onTabChange }: HeaderProps) {
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

  const handleInstall = async () => {
    if (isIOS) {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Instalar en iOS</h3>
            <ol class="space-y-3 text-gray-600 mb-6">
              <li>1. Toca el botón Compartir</li>
              <li>2. Desplázate y selecciona "Añadir a pantalla de inicio"</li>
              <li>3. Toca "Añadir" para instalar la app</li>
            </ol>
            <button onclick="this.parentElement.parentElement.remove()" class="w-full py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl">
              Entendido
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else if (deferredPrompt) {
      const result = await deferredPrompt.prompt();
      console.log(`Install prompt result: ${result}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <>
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
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button
                className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <LogIn size={18} />
                <span className="text-sm font-medium">Iniciar sesión</span>
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
      </header>

      {/* Menú móvil */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileMenu(false)}
      >
        <div 
          className={`absolute inset-y-0 right-0 w-80 bg-white/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Encabezado del menú */}
            <div className="p-4 border-b border-rose-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <ChefHat size={20} className="text-rose-500" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    <span className="font-light">Mi</span>
                    <span className="font-bold">Cocina</span>
                  </h2>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Botones principales */}
              <div className="space-y-2">
                {isInstallable && (
                  <button
                    onClick={handleInstall}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors"
                  >
                    {isIOS ? (
                      <>
                        <Share2 size={20} />
                        <span>Añadir a inicio</span>
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        <span>Instalar aplicación</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-rose-50 text-rose-600 rounded-xl font-medium hover:bg-rose-100 transition-colors"
                >
                  <LogIn size={20} />
                  <span>Iniciar sesión</span>
                </button>
              </div>
            </div>

            {/* Navegación */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                <Navigation
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    onTabChange(tab);
                    setShowMobileMenu(false);
                  }}
                  orientation="vertical"
                />
              </nav>
            </div>

            {/* Footer del menú */}
            <div className="p-4 border-t border-rose-100">
              <p className="text-xs text-center text-gray-500">
                Versión 1.0.0 • © 2024 MiCocina
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}