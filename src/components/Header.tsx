import React, { useState } from 'react';
import { ChefHat, Search, LogIn, Menu, X, Download, ChevronRight } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ searchTerm, onSearchChange, activeTab, onTabChange }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { 
      id: 'recetas', 
      icon: ChefHat, 
      label: 'Recetas',
      description: 'Explora recetas'
    },
    { 
      id: 'menu', 
      icon: ChefHat, 
      label: 'Menú',
      description: 'Planifica tu semana'
    },
    { 
      id: 'compra', 
      icon: ChefHat, 
      label: 'Compra',
      description: 'Lista de la compra'
    },
    { 
      id: 'favoritos', 
      icon: ChefHat, 
      label: 'Favoritos',
      description: 'Tus recetas favoritas'
    },
    { 
      id: 'peso', 
      icon: ChefHat, 
      label: 'Peso',
      description: 'Control de peso'
    }
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo y título */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-inner border border-white/20 group hover:bg-white/20 transition-all duration-300">
                <ChefHat size={20} className="text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">MiCocina</h1>
                <p className="text-xs text-rose-100 hidden md:block">Tu asistente culinario</p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Search size={20} />
              </button>
              <button className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
                <LogIn size={18} />
                <span className="text-sm font-medium">Iniciar sesión</span>
              </button>
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Barra de búsqueda expandible */}
          <div className={`overflow-hidden transition-all duration-300 ${
            showSearch ? 'h-14 opacity-100' : 'h-0 opacity-0'
          }`}>
            <div className="py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar recetas, ingredientes..."
                  className="w-full py-2 px-4 pr-10 rounded-xl text-gray-800 bg-white/10 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200 text-sm"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                />
                <div className="absolute right-3 top-2 bg-white/10 p-1.5 rounded-lg backdrop-blur-md">
                  <Search className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
        showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`absolute inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-4 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                    <ChefHat size={20} className="text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">MiCocina</h2>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t">
              <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl font-medium">
                <Download size={20} />
                <span>Descargar App</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}