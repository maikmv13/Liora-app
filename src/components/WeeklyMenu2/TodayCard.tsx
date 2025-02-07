import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, ChefHat, Heart, Calendar, 
  Flame, Cookie, Coffee, Sun, Moon, Eye
} from 'lucide-react';
import { MenuItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { useFavorites } from '../../hooks/useFavorites';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { MIN_FAVORITES_FOR_MENU } from './constants';
import { MenuSkeleton } from './MenuSkeleton';

interface TodayCardProps {
  menuItems: MenuItem[];
  onViewRecipe: (menuItem: MenuItem) => void;
  activeMenu: ExtendedWeeklyMenuDB | null;
  onOpenOnboarding?: () => void;
}

export function TodayCard({ 
  menuItems, 
  onViewRecipe, 
  activeMenu,
  onOpenOnboarding 
}: TodayCardProps) {
  const navigate = useNavigate();
  const { id, isHousehold } = useActiveProfile();
  
  // Obtener tanto favoritos personales como del household
  const { 
    favorites: personalFavorites, 
    loading: personalLoading 
  } = useFavorites(false);
  
  const { 
    favorites: householdFavorites, 
    loading: householdLoading 
  } = useFavorites(true);
  
  const { menuItems: activeMenuItems, loading: menuLoading } = useActiveMenu(id, isHousehold);
  const [expanded, setExpanded] = useState(false);
  
  // Formatear el día y la fecha
  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long'
  }).format(new Date())
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const mealTypes = ['desayuno', 'comida', 'snack', 'cena'];

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'desayuno':
        return <Coffee size={16} className="text-amber-500" />;
      case 'comida':
        return <Sun size={16} className="text-orange-500" />;
      case 'snack':
        return <Cookie size={16} className="text-emerald-500" />;
      case 'cena':
        return <Moon size={16} className="text-indigo-500" />;
      default:
        return null;
    }
  };

  const getMealTime = (meal: string): string => {
    switch (meal) {
      case 'desayuno':
        return '8:00';
      case 'comida':
        return '14:00';
      case 'snack':
        return '17:00';
      case 'cena':
        return '21:00';
      default:
        return '';
    }
  };

  const getMealTypeLabel = (meal: string): string => {
    switch (meal) {
      case 'desayuno':
        return 'Desayuno';
      case 'comida':
        return 'Almuerzo';
      case 'snack':
        return 'Merienda';
      case 'cena':
        return 'Cena';
      default:
        return '';
    }
  };

  const getMealColor = (meal: string): string => {
    switch (meal) {
      case 'desayuno':
        return 'bg-amber-100/80 border-amber-200 hover:bg-amber-100';
      case 'comida':
        return 'bg-orange-100/80 border-orange-200 hover:bg-orange-100';
      case 'snack':
        return 'bg-emerald-100/80 border-emerald-200 hover:bg-emerald-100';
      case 'cena':
        return 'bg-indigo-100/80 border-indigo-200 hover:bg-indigo-100';
      default:
        return 'bg-rose-100/80 border-rose-200 hover:bg-rose-100';
    }
  };

  const handleFavoriteClick = async (recipe: Recipe) => {
    try {
      if (recipe.user_id && recipe.user_id !== id) {
        return;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Unificar la lógica de carga
  const isLoading = menuLoading || personalLoading || householdLoading || 
    !personalFavorites || !householdFavorites || !activeMenuItems;
  
  // Si hay menú activo, significa que el household ya tiene suficientes favoritos
  const hasActiveMenu = menuItems?.length > 0;
  
  // Verificar si hay suficientes favoritos solo si no hay menú activo
  const totalFavorites = isHousehold ? householdFavorites.length : personalFavorites.length;
  const hasEnoughFavorites = hasActiveMenu || totalFavorites >= MIN_FAVORITES_FOR_MENU;

  // Asegurarse de que menuItems tenga la estructura correcta
  const todayMenuItems = React.useMemo(() => {
    if (!menuItems?.length) return [];
    
    // Filtrar solo las comidas de hoy
    return menuItems.filter(item => {
      const menuDay = new Intl.DateTimeFormat('es-ES', { 
        weekday: 'long'
      }).format(new Date())
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      return item.day?.toLowerCase() === menuDay;
    });
  }, [menuItems]);

  // Mostrar skeleton mientras cualquier dato está cargando
  if (isLoading) {
    return <MenuSkeleton />;
  }

  // Solo mostrar mensaje de favoritos insuficientes si:
  // 1. No hay menú activo Y
  // 2. No hay suficientes favoritos Y
  // 3. (No es household O no hay menú activo)
  if (!hasActiveMenu && !hasEnoughFavorites && (!isHousehold || !hasActiveMenu)) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Crea tu primer menú!
        </h3>
        <p className="text-gray-600 mb-4">
          {isHousehold 
            ? `Tu household necesita al menos ${MIN_FAVORITES_FOR_MENU} recetas favoritas para generar un menú. Actualmente tienen ${totalFavorites}.`
            : `Necesitas al menos ${MIN_FAVORITES_FOR_MENU} recetas favoritas para generar un menú. Actualmente tienes ${totalFavorites}.`
          }
        </p>
        <button
          onClick={() => navigate('/recipes')}
          className="w-full px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
        >
          Ir a Recetas
        </button>
      </div>
    );
  }

  // Solo mostrar mensaje de generar menú si no hay menú activo pero hay suficientes favoritos
  if (!hasActiveMenu && hasEnoughFavorites) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Genera tu menú semanal!
        </h3>
        <p className="text-gray-600 mb-4">
          {isHousehold 
            ? 'Tu household tiene suficientes recetas favoritas para generar un menú.'
            : 'Tienes suficientes recetas favoritas para generar un menú.'
          }
        </p>
        <button
          onClick={() => navigate('/menu/generate')}
          className="w-full px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
        >
          Generar Menú
        </button>
      </div>
    );
  }

  // Si hay menú activo, mostrar el menú sin importar el número de favoritos
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-200 shadow-lg overflow-hidden mt-2">
      {/* Header Mejorado */}
      <div className="px-6 py-4 border-b border-rose-200 bg-gradient-to-r from-orange-100 to-rose-100">
        <div className="flex items-center space-x-4">
          <div className="bg-white/80 p-3 rounded-xl shadow-sm border border-rose-200">
            <Calendar size={24} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Hoy, <span className="capitalize">{today}</span>
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-rose-200">
        {mealTypes.map((mealType) => {
          const menuItem = todayMenuItems.find(item => item.meal === mealType);
          
          return (
            <div
              key={mealType}
              className={`relative ${
                menuItem ? getMealColor(mealType) : 'hover:bg-gray-50'
              }`}
            >
              <div className="p-3">
                {/* Time and Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${menuItem ? 'bg-white/50' : 'bg-gray-50'}`}>
                      {getMealIcon(mealType)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">
                        {getMealTime(mealType)}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                        {getMealTypeLabel(mealType)}
                      </span>
                    </div>
                  </div>
                  {menuItem?.recipe.calories && (
                    <div className="flex items-center space-x-1 bg-white/80 px-1.5 py-0.5 rounded-lg">
                      <Flame size={10} className="text-rose-500" />
                      <span className="text-[10px] font-medium text-rose-600">
                        {menuItem.recipe.calories}
                      </span>
                    </div>
                  )}
                </div>

                {menuItem ? (
                  <div className="relative">
                    {/* Mobile Layout */}
                    <div className="sm:hidden flex space-x-3">
                      {/* Square Image - Reduced size */}
                      {menuItem.recipe.image_url ? (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={menuItem.recipe.image_url}
                            alt={menuItem.recipe.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ChefHat size={20} className="text-gray-400" />
                        </div>
                      )}

                      {/* Recipe Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                          {menuItem.recipe.name}
                        </h4>
                        {menuItem.recipe.side_dish && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                            {menuItem.recipe.side_dish}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {menuItem.recipe.category}
                        </p>
                      </div>

                      {/* Botón Ver siempre visible */}
                      <button
                        onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                        className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors border border-rose-200"
                        title="Ver receta"
                      >
                        <Eye size={16} />
                      </button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex space-x-3">
                        {menuItem.recipe.image_url && (
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={menuItem.recipe.image_url}
                              alt={menuItem.recipe.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-base text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                            {menuItem.recipe.name}
                          </h4>
                          {menuItem.recipe.side_dish && (
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {menuItem.recipe.side_dish}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {menuItem.recipe.category}
                          </p>
                        </div>

                        {/* Botón Ver siempre visible */}
                        <button
                          onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                          className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors border border-rose-200"
                          title="Ver receta"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Sin planificar</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}