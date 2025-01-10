import React, { useState } from 'react';
import { ChefHat, Search, LogIn } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo y título */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl shadow-inner border border-white/20 group hover:bg-white/20 transition-all duration-300">
                <ChefHat size={24} className="text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">MiCocina</h1>
                <p className="text-rose-100 text-xs">Tu asistente culinario</p>
              </div>
            </div>
            
            {/* Botón de login (visible solo en mobile) */}
            <button className="md:hidden flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
              <LogIn size={18} />
              <span className="text-sm font-medium">Entrar</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Barra de búsqueda */}
            <div className={`relative flex-1 md:max-w-md transition-all duration-300 ${
              isSearchFocused ? 'md:max-w-xl' : ''
            }`}>
              <input
                type="text"
                placeholder="Buscar recetas, ingredientes..."
                className="w-full py-2.5 px-4 pr-12 rounded-xl text-gray-800 bg-white/10 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200 text-sm"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className="absolute right-3 top-2.5 bg-white/10 p-1.5 rounded-lg backdrop-blur-md">
                <Search className="text-white" size={16} />
              </div>
            </div>

            {/* Botón de login (visible solo en desktop) */}
            <button className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 whitespace-nowrap">
              <LogIn size={18} />
              <span className="text-sm font-medium">Iniciar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}