import React, { useState } from 'react';
import { Sparkles, Search, Menu as MenuIcon, X, User, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';

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
  const navigate = useNavigate();

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'recetas':
        return 'Recetas';
      case 'menu':
        return 'Menú';
      case 'compra':
        return 'Lista de Compra';
      case 'vida-sana':
        return 'Vida Sana';
      case 'profile':
        return 'Mi Perfil';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg border border-white/20 group hover:bg-white/20 transition-all duration-300">
                <Leaf size={24} className="text-white transform rotate-45 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl tracking-tight text-white font-bold font-display bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
                  Liora
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-white/80 font-medium">
                  Life in Balance
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {activeTab !== 'salud' && (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <Search size={20} />
                </button>
              )}
              {user ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <User size={20} />
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white border border-white/20"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                <Leaf size={20} className="text-white transform rotate-45" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl tracking-tight text-white font-bold font-display bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">
                  Liora
                </h1>
                <span className="text-[8px] uppercase tracking-widest text-white/80 font-medium">
                  Life in Balance
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {user ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300"
                >
                  <User size={20} className="text-white" />
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300"
                >
                  <User size={20} className="text-white" />
                </button>
              )}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="relative group"
              >
                <div className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300">
                  <div className="w-5 space-y-1">
                    <span className="block h-0.5 w-full bg-white transform transition-all duration-300 group-hover:rotate-45 group-hover:translate-y-1.5"></span>
                    <span className="block h-0.5 w-full bg-white transition-all duration-300 group-hover:opacity-0"></span>
                    <span className="block h-0.5 w-full bg-white transform transition-all duration-300 group-hover:-rotate-45 group-hover:-translate-y-1.5"></span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        user={user}
        onLogin={onLogin}
        onProfile={onProfile}
        activeTab={activeTab}
      />
    </>
  );
}