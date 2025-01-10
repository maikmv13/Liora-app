import React, { useState, useEffect } from 'react';
import { ChefHat, Search, LogIn, Menu, X, Download, Share2 } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ searchTerm, onSearchChange, activeTab, onTabChange }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
    <header className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg shadow-inner border border-white/20 group hover:bg-white/20 transition-all duration-300">
              <ChefHat size={20} className="text-white transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold tracking-tight">MiCocina</h1>
              <p className="text-rose-100 text-xs">Tu asistente culinario</p>
            </div>
          </div>

          {/* Barra de búsqueda */}
          {activeTab !== 'peso' && (
            <div className={`relative flex-1 max-w-md mx-4 transition-all duration-300 ${
              isSearchFocused ? 'max-w-xl' : ''
            }`}>
              <input
                type="text"
                placeholder="Buscar recetas, ingredientes..."
                className="w-full py-1.5 px-3 pr-8 rounded-lg text-gray-800 bg-white/10 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200 text-sm"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search size={16} className="absolute right-2.5 top-2 text-white/70" />
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center space-x-2">
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                {isIOS ? (
                  <>
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Instalar</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span className="text-sm font-medium">Instalar</span>
                  </>
                )}
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

      {/* Menú móvil */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
        showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`absolute inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Menú</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl font-medium mb-4"
              >
                {isIOS ? (
                  <>
                    <Share2 size={20} />
                    <span>Añadir a inicio</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Instalar app</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}