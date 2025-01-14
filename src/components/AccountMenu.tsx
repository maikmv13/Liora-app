import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, History, Heart, 
  Bell, LogOut, ChevronRight, Sun
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'user' | 'nutritionist';
  userName: string;
}

export function AccountMenu({ isOpen, onClose, userType, userName }: AccountMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/menu');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 border border-rose-100/20 backdrop-blur-sm"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-rose-100/20">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 p-2 rounded-lg">
            <User size={20} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userType}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <User size={16} />
            </div>
            <span>Mi Perfil</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

        <button
          onClick={() => navigate('/favoritos')}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <Heart size={16} />
            </div>
            <span>Favoritos</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

        <button
          onClick={() => {/* TODO: Implement history view */}}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <History size={16} />
            </div>
            <span>Historial</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

        <button
          onClick={() => {/* TODO: Implement notifications */}}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <Bell size={16} />
            </div>
            <span>Notificaciones</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

        <button
          onClick={() => {/* TODO: Implement preferences */}}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <Sun size={16} />
            </div>
            <span>Preferencias</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

        <button
          onClick={() => {/* TODO: Implement settings */}}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-white transition-colors">
              <Settings size={16} />
            </div>
            <span>Configuración</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>
      </div>

      {/* Logout */}
      <div className="pt-2 border-t border-rose-100/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-500 group-hover:bg-white transition-colors">
              <LogOut size={16} />
            </div>
            <span>Cerrar sesión</span>
          </div>
        </button>
      </div>
    </div>
  );
}