import React from 'react';
import { Copy, Trash2, Calendar, Utensils, Moon, Flame } from 'lucide-react';
import { MenuItem } from '../../types';
import { weekDays } from './utils';

interface MenuHistoryProps {
  history: {
    id: string;
    date: string;
    menu: MenuItem[];
  }[];
  onRestore: (menu: MenuItem[]) => void;
  onDelete: (id: string) => void;
}

export function MenuHistory({ history, onRestore, onDelete }: MenuHistoryProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const calculateDayCalories = (menu: MenuItem[], day: string) => {
    return menu
      .filter(item => item.day === day)
      .reduce((total, item) => total + parseInt(item.recipe.Calorias.replace(/\D/g, '')), 0);
  };

  const calculateTotalCalories = (menu: MenuItem[]) => {
    return menu.reduce((total, item) => total + parseInt(item.recipe.Calorias.replace(/\D/g, '')), 0);
  };

  if (history.length === 0) return null;

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
                        Generado el {formatDate(historyMenu.date)}
                      </p>
                      <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                        <Flame size={10} className="text-rose-500" />
                        <span className="text-[10px] font-medium text-rose-600">
                          {calculateTotalCalories(historyMenu.menu)} kcal/semana
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRestore(historyMenu.menu)}
                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                    title="Usar este menú"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(historyMenu.id)}
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
                  const dayMenu = historyMenu.menu.filter(item => item.day === day);
                  const comida = dayMenu.find(item => item.meal === 'comida');
                  const cena = dayMenu.find(item => item.meal === 'cena');
                  const dayCalories = calculateDayCalories(historyMenu.menu, day);
                  
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
                              {comida ? comida.recipe.Plato : '-'}
                            </span>
                          </div>
                          {comida && (
                            <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                              <Flame size={10} className="text-rose-500" />
                              <span className="text-[10px] font-medium text-rose-600">{comida.recipe.Calorias}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between space-x-2 bg-white rounded-lg p-2 border border-rose-100">
                          <div className="flex items-center space-x-2 min-w-0">
                            <Moon size={16} className="text-rose-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">
                              {cena ? cena.recipe.Plato : '-'}
                            </span>
                          </div>
                          {cena && (
                            <div className="flex items-center space-x-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                              <Flame size={10} className="text-rose-500" />
                              <span className="text-[10px] font-medium text-rose-600">{cena.recipe.Calorias}</span>
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