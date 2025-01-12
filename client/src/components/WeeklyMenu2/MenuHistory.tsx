import React, { useEffect, useState } from 'react';
import { Copy, Trash2, Calendar, Utensils, Moon, Flame } from 'lucide-react';
import { MenuItem, MealType, Recipe } from '../../types';
import { weekDays } from './utils';
import { getMenuHistory, deleteMenu, restoreMenu } from '../../services/weeklyMenu';
import type { ExtendedWeeklyMenuDB, RecipeData } from './index';
import { supabase } from '../../lib/supabase';

interface MenuHistoryProps {
  onRestore: (menu: MenuItem[]) => void;
}

export function MenuHistory({ onRestore }: MenuHistoryProps) {
  const [history, setHistory] = useState<ExtendedWeeklyMenuDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuCalories, setMenuCalories] = useState<Record<string, number>>({});
  const [convertedMenus, setConvertedMenus] = useState<Record<string, MenuItem[]>>({});

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    history.forEach(async (menu) => {
      const calories = await calculateTotalCalories(menu);
      setMenuCalories(prev => ({ ...prev, [menu.id]: calories }));
    });
  }, [history]);

  useEffect(() => {
    history.forEach(async (menu) => {
      const items = await convertDBToMenuItems(menu);
      setConvertedMenus(prev => ({ ...prev, [menu.id]: items }));
    });
  }, [history]);

  const loadHistory = async () => {
    try {
      const data = await getMenuHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (menuId: string, menu: ExtendedWeeklyMenuDB) => {
    try {
      await restoreMenu(menuId);
      // Convertir el menú al formato antiguo para la restauración
      const menuItems = await convertDBToMenuItems(menu);
      onRestore(menuItems);
      loadHistory();
    } catch (error) {
      console.error('Error al restaurar el menú:', error);
    }
  };

  // Función auxiliar para convertir el menú
  const convertDBToMenuItems = async (menu: ExtendedWeeklyMenuDB): Promise<MenuItem[]> => {
    const menuItems: MenuItem[] = [];
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const meals: MealType[] = ['desayuno', 'comida', 'snack', 'cena'];

    // Obtener todas las recetas necesarias de una vez
    const recipeIds = Object.values(menu).filter(value => 
      typeof value === 'string' && value.length > 0
    ) as string[];

    const { data: recipes } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds);

    const recipesMap = new Map(
      recipes?.map((recipe: Recipe) => [recipe.id, recipe]) || []
    );

    days.forEach(day => {
      meals.forEach(meal => {
        const fieldName = `${day}_${meal}` as keyof ExtendedWeeklyMenuDB;
        const recipeId = menu[fieldName];
        
        if (typeof recipeId === 'string' && recipeId.length > 0) {
          const recipe = recipesMap.get(recipeId);
          if (recipe) {
            menuItems.push({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              meal,
              recipe
            });
          }
        }
      });
    });

    return menuItems;
  };

  // Calcular calorías totales para un menú
  const calculateTotalCalories = async (menu: ExtendedWeeklyMenuDB) => {
    const menuItems = await convertDBToMenuItems(menu);
    return menuItems.reduce((total, item) => 
      total + parseInt(item.recipe.calories?.replace(/\D/g, '') || '0'), 0
    );
  };

  const handleDelete = async (menuId: string) => {
    try {
      await deleteMenu(menuId);
      setHistory(prev => prev.filter(menu => menu.id !== menuId));
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
        {history.map((historyMenu, index) => (
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
                      Menú de la semana {history.length - index}
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