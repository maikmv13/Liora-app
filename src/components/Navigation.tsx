import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Calendar, ShoppingCart, Bot, Heart, Activity } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orientation?: 'horizontal' | 'vertical';
  user?: any;
}

export function Navigation({ activeTab, onTabChange, orientation = 'horizontal', user }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Función helper para obtener la pestaña activa
  const getActiveTab = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/recetas':
        return 'recetas';
      case '/favoritos':
        return 'favoritos';
      case '/menu':
        return 'menu';
      case '/compra':
        return 'compra';
      case '/salud':
        return 'salud';
      case '/profile':
        return 'profile';
      case path.match(/^\/recipe\//)?.input:
        return 'recetas';
      default:
        return activeTab;
    }
  };

  const currentTab = getActiveTab();

  const handleTabChange = (id: string) => {
    onTabChange(id);
    // Mapeo de pestañas a rutas
    const routeMap: { [key: string]: string } = {
      'recetas': '/recetas',
      'favoritos': '/favoritos',
      'menu': '/menu',
      'compra': '/compra',
      'salud': '/salud',
      'profile': '/profile'
    };
    navigate(routeMap[id] || `/${id}`);
  };

  const navItems = [
    { 
      id: 'recetas', 
      icon: ChefHat, 
      label: 'Recetas',
      description: 'Explorar'
    },
    { 
      id: 'menu', 
      icon: Calendar, 
      label: 'Menú',
      description: 'Planificar'
    },
    { 
      id: 'compra', 
      icon: ShoppingCart, 
      label: 'Compra',
      description: 'Lista'
    },
    {
      id: 'salud',
      icon: Activity,
      label: 'Objetivos',
      description: 'Seguimiento'
    }
  ];

  if (orientation === 'vertical') {
    return (
      <div className="space-y-1">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
              currentTab === id
                ? 'bg-white/10 text-white'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <nav className="fixed z-40 w-full bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-lg md:sticky md:top-16 md:border-t-0 md:border-b md:shadow-sm bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex items-stretch">
          {navItems.map(({ id, icon: Icon, label, description }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`group flex-1 py-3 md:py-4 transition-all duration-200 relative ${
                currentTab === id
                  ? 'text-rose-500'
                  : 'text-gray-600 hover:text-rose-400'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center md:justify-start md:px-4 md:space-x-2">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  currentTab === id 
                    ? 'bg-rose-50' 
                    : 'group-hover:bg-rose-50/50'
                }`}>
                  <Icon 
                    size={20} 
                    className={`transition-all duration-300 ${
                      currentTab === id 
                        ? 'transform scale-110' 
                        : 'group-hover:scale-110'
                    }`} 
                  />
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="font-medium text-xs md:text-sm">{label}</span>
                  <span className="hidden md:block text-xs text-gray-400 group-hover:text-rose-400 transition-colors">
                    {description}
                  </span>
                </div>
              </div>
              {currentTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 md:top-0 md:bottom-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}