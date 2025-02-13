import React, { useState } from 'react';
import { 
  Clock, Users, ChefHat, Heart, Calendar, 
  Flame, Cookie, Coffee, Sun, Moon, Eye
} from 'lucide-react';
import { MenuItem } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
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
  const { menuItems: activeMenuItems, loading: menuLoading } = useActiveMenu(id, isHousehold);
  
  // Debug logs
  console.log('TodayCard - Props menuItems:', menuItems);
  console.log('TodayCard - ActiveMenuItems:', activeMenuItems);
  
  // Formatear el día y la fecha
  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long'
  }).format(new Date())
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  console.log('TodayCard - Today:', today);

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

  // Simplificar la lógica de carga
  const isLoading = menuLoading;

  // Usar los menuItems de props en lugar de activeMenuItems
  const todayMenuItems = React.useMemo(() => {
    if (!menuItems?.length) return [];
    
    const filtered = menuItems.filter(item => {
      const itemDay = item.day.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log('Comparing days:', { itemDay, today });
      return itemDay === today;
    });

    console.log('TodayCard - Filtered items:', filtered);
    return filtered;
  }, [menuItems, today]);

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <MenuSkeleton />;
  }

  // Si no hay menú activo, mostrar botón para generar
  if (!menuItems?.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Genera tu menú semanal!
        </h3>
        <p className="text-gray-600 mb-4">
          Planifica tus comidas de la semana de forma fácil y rápida.
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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-200 shadow-lg overflow-hidden mt-2">
      {/* Header Mejorado */}
      <div className="relative h-32">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80" 
            alt="Food pattern" 
            className="w-full h-full object-cover opacity-20"
          />
          {/* Overlay con gradiente suave */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-rose-50" />
        </div>

        {/* Contenido del header */}
        <div className="relative h-full px-6 py-4 flex flex-col justify-between">
          {/* Pregunta principal */}
          <h2 className="text-base text-gray-500 font-medium">
            ¿Qué como hoy?
          </h2>

          {/* Fecha y día */}
          <div className="space-y-0.5">
            <h3 className="text-2xl font-bold text-gray-900 capitalize">
              {today}
            </h3>
            <p className="text-sm text-gray-600">
              {formattedDate}
            </p>
          </div>

          {/* Decoración */}
          <div className="absolute top-4 right-4 text-rose-200">
            <Calendar size={80} />
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-rose-200">
        {mealTypes.map((mealType) => {
          const menuItem = todayMenuItems.find(item => item.meal === mealType);
          console.log(`TodayCard - MealType: ${mealType}, MenuItem:`, menuItem);
          
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

                {menuItem?.recipe ? (
                  <div className="relative">
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex space-x-3">
                        {/* Square Image - Small size with Eye button overlay */}
                        <div 
                          onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                          className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                        >
                          {menuItem.recipe.image_url ? (
                            <>
                              <img
                                src={menuItem.recipe.image_url}
                                alt={menuItem.recipe.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Eye overlay */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-all duration-200">
                                <Eye size={16} className="text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-rose-50 flex items-center justify-center">
                              <ChefHat size={20} className="text-rose-300" />
                            </div>
                          )}
                        </div>

                        {/* Recipe Info */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                            className="font-medium text-base text-gray-900 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {menuItem.recipe.name}
                          </h4>
                          {menuItem.recipe.side_dish && (
                            <p 
                              onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                              className="text-sm text-gray-500 mt-0.5 cursor-pointer hover:text-rose-500 transition-colors line-clamp-1"
                            >
                              {menuItem.recipe.side_dish}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {menuItem.recipe.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex space-x-3">
                        {/* Imagen clicable */}
                        {menuItem.recipe.image_url && (
                          <div 
                            onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                            className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={menuItem.recipe.image_url}
                              alt={menuItem.recipe.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        )}

                        {/* Contenido clicable */}
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                            className="font-medium text-base text-gray-900 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {menuItem.recipe.name}
                          </h4>
                          {menuItem.recipe.side_dish && (
                            <p 
                              onClick={() => navigate(`/recipe/${menuItem.recipe.id}`)}
                              className="text-sm text-gray-500 mt-0.5 cursor-pointer hover:text-rose-500 transition-colors line-clamp-1"
                            >
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