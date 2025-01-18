import React, { useState } from 'react';
import { 
  Bot, Sparkles, History, Settings, Sun, Moon, 
  Plus, User, Circle, LogOut, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface ChatHeaderProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNewChat?: () => void;
  onClearChat?: () => void;
}

export function ChatHeader({ 
  isDarkMode = false, 
  onToggleDarkMode, 
  onNewChat,
  onClearChat 
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor connection status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        sticky top-0 z-50 backdrop-blur-md border-b
        ${isDarkMode 
          ? 'bg-gray-900/90 border-gray-700/50 text-white' 
          : 'bg-white/90 border-rose-100/20 text-gray-900'
        }
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`
                relative p-2 rounded-xl shadow-lg border
                ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-rose-100'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bot size={24} className="text-rose-500" />
              <motion.div 
                className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles size={8} className="text-white" />
              </motion.div>
            </motion.div>
            
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                Liora AI
              </h1>
              <div className="flex items-center space-x-2">
                <Circle size={8} className={isOnline ? 'text-green-500 fill-green-500' : 'text-gray-400'} />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isOnline ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavButton icon={Home} label="Inicio" onClick={() => navigate('/')} />
            <NavButton icon={History} label="Historial" onClick={() => {}} />
            <NavButton icon={Settings} label="Configuración" onClick={() => {}} />
            
            {/* New Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewChat}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
                ${isDarkMode
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90'
                }
                transition-all duration-200 shadow-sm
              `}
            >
              <Plus size={20} />
              <span>Nuevo Chat</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              className={`
                p-2 rounded-xl transition-colors
                ${isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-500'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`
                  flex items-center space-x-2 p-2 rounded-xl transition-colors
                  ${isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                <User size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`
                      absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 border
                      ${isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                      }
                    `}
                  >
                    <button
                      onClick={handleLogout}
                      className={`
                        flex items-center space-x-2 w-full px-4 py-2 text-sm
                        ${isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {}}
          >
            <motion.div
              className="w-6 h-5 flex flex-col justify-between"
              initial={false}
            >
              <motion.span className="w-full h-0.5 bg-current rounded-full transform origin-left" />
              <motion.span className="w-full h-0.5 bg-current rounded-full" />
              <motion.span className="w-full h-0.5 bg-current rounded-full transform origin-left" />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

// Helper component for navigation buttons
function NavButton({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void; 
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
      title={label}
    >
      <Icon size={20} className="text-gray-700" />
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}