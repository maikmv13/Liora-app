import React, { useEffect, useState } from 'react';
import { Copy, Trash2, Calendar, Utensils, Moon, Flame } from 'lucide-react';
import { MenuItem, MealType, Recipe } from '../../types';
import { weekDays } from './utils';
import { getMenuHistory, deleteMenu, restoreMenu } from '../../services/weeklyMenu';
import type { ExtendedWeeklyMenuDB, RecipeData } from './index';
import { supabase } from '../../lib/supabase';

interface MenuHistoryProps {
  onRestore: (menu: MenuItem[]) => void;
  history: ExtendedWeeklyMenuDB[];
  onHistoryChange: (value: ExtendedWeeklyMenuDB[] | ((prev: ExtendedWeeklyMenuDB[]) => ExtendedWeeklyMenuDB[])) => void;
  onMenuArchived: (menu: ExtendedWeeklyMenuDB) => void;
}

export function MenuHistory({ onRestore, history, onHistoryChange, onMenuArchived }: MenuHistoryProps) {
  const [loading, setLoading] = useState(false);
  const [menuCalories, setMenuCalories] = useState<Record<string, number>>({});
  const [convertedMenus, setConvertedMenus] = useState<Record<string, MenuItem[]>>({});

  useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true);
      try {
        const batchSize = 3; // Procesar 3 menús a la vez
        const caloriesData: Record<string, number> = {};
        const convertedData: Record<string, MenuItem[]> = {};

        for (let i = 0; i < history.length; i += batchSize) {
          const batch = history.slice(i, i + batchSize);
          const batchPromises = batch.map(async (menu) => {
            const items = await convertDBToMenuItems(menu);
            convertedData[menu.id] = items;
            
            const calories = items.reduce((total, item) => 
              total + parseInt(item.recipe.calories?.replace(/\D/g, '') || '0'), 0
            );
            caloriesData[menu.id] = calories;
          });

          await Promise.all(batchPromises);
        }

        setConvertedMenus(convertedData);
        setMenuCalories(caloriesData);
      } finally {
        setLoading(false);
      }
    };

    if (history.length > 0) {
      loadMenuData();
    }
  }, [history]);

  const handleRestore = async (menuId: string, menu: ExtendedWeeklyMenuDB) => {
    try {
      await restoreMenu(menuId);
      const menuItems = await convertDBToMenuItems(menu);
      onRestore(menuItems);
    } catch (error) {
      console.error('Error al restaurar el menú:', error);
    }
  };

  // Primero, agregar los mapeos necesarios
  const dayMapping: Record<string, string> = {
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
  };

  const mealMapping: Record<string, string> = {
    'breakfast': 'desayuno',
    'lunch': 'comida',
    'snack': 'snack',
    'dinner': 'cena'
  };

  // Actualizar la función convertDBToMenuItems para hacer una sola llamada a la base de datos
  const convertDBToMenuItems = async (menu: ExtendedWeeklyMenuDB): Promise<MenuItem[]> => {
    const menuItems: MenuItem[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const meals = ['breakfast', 'lunch', 'snack', 'dinner'];

    // Recolectar todos los IDs de recetas primero
    const recipeIds = Object.entries(menu)
      .filter(([key, value]) => 
        days.some(day => key.startsWith(day)) && value !== null
      )
      .map(([_, value]) => value) as string[];

    // Obtener todas las recetas en una sola llamada
    const { data: recipes } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds);

    if (!recipes) return menuItems;

    // Crear un mapa para acceso rápido
    const recipeMap = new Map(recipes.map(recipe => [recipe.id, recipe]));

    // Construir los menuItems usando el mapa
    for (const day of days) {
      for (const meal of meals) {
        const fieldName = `${day}_${meal}` as keyof ExtendedWeeklyMenuDB;
        const recipeId = menu[fieldName];
        
        if (recipeId) {
          const recipe = recipeMap.get(recipeId);
          if (recipe) {
            menuItems.push({
              day: dayMapping[day],
              meal: mealMapping[meal] as MealType,
              recipe
            });
          }
        }
      }
    }

    return menuItems;
  };

  const handleDelete = async (menuId: string) => {
    try {
      await deleteMenu(menuId);
      onHistoryChange(prev => prev.filter(menu => menu.id !== menuId));
    } catch (error) {
      console.error('Error al eliminar el menú:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const calculateDayCalories = (menu: MenuItem[], day: string): number => 
    menu
      .filter((item: MenuItem) => item.day === day)
      .reduce((total, item) => total + parseInt(item.recipe.calories?.replace(/\D/g, '') || '0'), 0);

  const getMenuItemsForDay = async (menu: ExtendedWeeklyMenuDB, day: string): Promise<MenuItem[]> => {
    const menuItems = await convertDBToMenuItems(menu);
    return menuItems.filter(item => item.day === day);
  };

  // Agregar función para calcular el número de semana
  const getWeekNumber = (menu: ExtendedWeeklyMenuDB) => {
    // Ordenar los menús por fecha de creación, del más nuevo al más antiguo
    const sortedMenus = [...history].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Encontrar el índice del menú actual en el array ordenado
    const menuIndex = sortedMenus.findIndex(m => m.id === menu.id);
    
    // El número de semana será el índice + 1 (para empezar desde 1 en lugar de 0)
    return sortedMenus.length - menuIndex;
  };

  if (loading) {
    return <div className="text-center py-4">Cargando historial...</div>;
  }

  if (history.length === 0) {
    return <div className="text-center py-4 text-gray-500">No hay menús guardados</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Historial de menús</h3>
        <span className="text-sm text-gray-500">{history.length} menús guardados</span>
      </div>

      <div className="grid gap-4">
        {history.map((historyMenu) => (
          <div 
            key={historyMenu.id}
            className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-rose-100 overflow-hidden hover:border-rose-200 transition-all duration-200"
          >
            {/* Cabecera */}
            <div className="p-4 border-b border-rose-100 bg-gradient-to-r from-orange-50 to-rose-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-rose-100 p-2 rounded-lg">
                    <Calendar size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Menú de la semana {getWeekNumber(historyMenu)}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-500">
                        Generado el {formatDate(historyMenu.created_at)}
                      </p>
                      <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                        <Flame size={10} className="text-rose-500" />
                        <span className="text-[10px] font-medium text-rose-600">
                          {menuCalories[historyMenu.id] || 'Calculando...'} kcal/semana
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(historyMenu.id, historyMenu)}
                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                    title="Usar este menú"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(historyMenu.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                    title="Eliminar del historial"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido del menú */}
            <div className="p-4">
              <div className="grid gap-3">
                {weekDays.map(day => {
                  const dayMenu = convertedMenus[historyMenu.id] || [];
                  const comida = dayMenu.find(item => item.day === day && item.meal === 'comida');
                  const cena = dayMenu.find(item => item.day === day && item.meal === 'cena');
                  const dayCalories = calculateDayCalories(dayMenu, day);
                  
                  return (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 items-center">
                      <div className="flex items-center justify-between md:justify-start space-x-2 font-medium text-gray-700 md:col-span-1">
                        <span>{day}</span>
                        <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200 md:hidden">
                          <Flame size={10} className="text-rose-500" />
                          <span className="text-[10px] font-medium text-rose-600">{dayCalories} kcal</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-5">
                        <div className="flex items-center justify-between space-x-2 bg-white rounded-lg p-2 border border-rose-100">
                          <div className="flex items-center space-x-2 min-w-0">
                            <Utensils size={16} className="text-rose-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">
                              {comida ? comida.recipe.name : '-'}
                            </span>
                          </div>
                          {comida && (
                            <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                              <Flame size={10} className="text-rose-500" />
                              <span className="text-[10px] font-medium text-rose-600">{comida.recipe.calories} kcal</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between space-x-2 bg-white rounded-lg p-2 border border-rose-100">
                          <div className="flex items-center space-x-2 min-w-0">
                            <Moon size={16} className="text-rose-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">
                              {cena ? cena.recipe.name : '-'}
                            </span>
                          </div>
                          {cena && (
                            <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                              <Flame size={10} className="text-rose-500" />
                              <span className="text-[10px] font-medium text-rose-600">{cena.recipe.calories} kcal</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}