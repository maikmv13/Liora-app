import React, { useState } from 'react';
import { ChefHat, Search, LogIn } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
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
            <button className="md:hidden flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200">
              <LogIn size={16} />
              <span className="text-sm font-medium">Entrar</span>
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
  );
}