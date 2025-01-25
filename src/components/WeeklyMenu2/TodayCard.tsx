import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, ChefHat, Heart, Calendar, 
  Flame, Cookie, Coffee, Sun, Moon, Eye
} from 'lucide-react';
import { MenuItem } from '../../types';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { useFavorites } from '../../hooks/useFavorites';

interface TodayCardProps {
  menuItems: MenuItem[];
  onViewRecipe: (menuItem: MenuItem) => void;
  activeMenu: any;
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
  const { favorites } = useFavorites(isHousehold);
  
  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long'
  }).format(new Date())
    .toLowerCase() // convertir a minúsculas para comparar
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remover acentos

  const todayFormatted = new Date().toISOString().split('T')[0];

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
        return 'bg-amber-50 border-amber-100 hover:bg-amber-100/50';
      case 'comida':
        return 'bg-orange-50 border-orange-100 hover:bg-orange-100/50';
      case 'snack':
        return 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50';
      case 'cena':
        return 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50';
      default:
        return 'bg-rose-50 border-rose-100 hover:bg-rose-100/50';
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

  if (menuItems.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-rose-50 p-3 rounded-xl flex-shrink-0">
              <Calendar size={24} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                ¡Crea tu primer menú semanal!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Para generar tu menú personalizado, sigue estos pasos:
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-rose-500">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Ve a la sección de <span className="font-medium text-gray-900">Recetas</span> y explora nuestro catálogo
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-rose-500">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Guarda como favoritas al menos <span className="font-medium text-gray-900">dos recetas por comida</span> (desayuno, comida, snack y cena)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-rose-500">3</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Genera tu menú semanal personalizado basado en tus recetas favoritas
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-3">
            <button
              onClick={() => navigate('/recetas')}
              className="w-full px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center space-x-2"
            >
              <ChefHat size={18} />
              <span>Explorar recetas</span>
            </button>

            <button
              onClick={onOpenOnboarding}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <Calendar size={18} />
              <span>Crear menú semanal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center space-x-2">
          <div className="bg-rose-100 p-1.5 rounded-lg">
            <Calendar size={16} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">{today}</h3>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-rose-100">
        {mealTypes.map((mealType) => {
          const menuItem = menuItems.find(item => item.meal === mealType);
          
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