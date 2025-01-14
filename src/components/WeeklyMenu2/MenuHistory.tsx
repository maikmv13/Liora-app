import React, { useState } from 'react';
import { Copy, Trash2, Calendar, Utensils, Moon, Flame, Search, Filter, ChevronDown, Star, Share2, Clock, ArrowUpDown } from 'lucide-react';
import { MenuItem } from '../../types';
import { weekDays } from './utils';
import { deleteMenu, restoreMenu } from '../../services/weeklyMenu';
import type { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';

interface MenuHistoryProps {
  onRestore: (menu: MenuItem[]) => void;
  history: ExtendedWeeklyMenuDB[];
  onHistoryChange: (value: ExtendedWeeklyMenuDB[]) => void;
  onMenuArchived: (menu: ExtendedWeeklyMenuDB) => void;
}

type SortOption = 'date' | 'calories' | 'rating';
type FilterOption = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

export function MenuHistory({ onRestore, history, onHistoryChange, onMenuArchived }: MenuHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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

  const getWeekNumber = (menu: ExtendedWeeklyMenuDB) => {
    const sortedMenus = [...history].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const menuIndex = sortedMenus.findIndex(m => m.id === menu.id);
    return sortedMenus.length - menuIndex;
  };

  // Filter and sort menus
  const filteredMenus = history
    .filter(menu => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return Object.entries(menu)
          .some(([key, value]) => 
            key.includes('_lunch') || key.includes('_dinner') ? 
            String(value).toLowerCase().includes(searchLower) : false
          );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'calories':
          // Implement calorie sorting logic
          return 0;
        case 'rating':
          // Implement rating sorting logic
          return 0;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const paginatedMenus = filteredMenus.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-rose-100/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Historial de menús</h3>
          <span className="text-sm text-gray-500">{history.length} menús guardados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en el historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown size={18} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 px-3 py-2 bg-white rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
            >
              <option value="date">Fecha</option>
              <option value="calories">Calorías</option>
              <option value="rating">Valoración</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="flex-1 px-3 py-2 bg-white rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">Todas las comidas</option>
              <option value="breakfast">Desayunos</option>
              <option value="lunch">Comidas</option>
              <option value="dinner">Cenas</option>
              <option value="snack">Snacks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu cards */}
      <div className="grid gap-4">
        {paginatedMenus.map((historyMenu) => (
          <div 
            key={historyMenu.id}
            className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-rose-100 overflow-hidden hover:border-rose-200 transition-all duration-200"
          >
            {/* Menu header */}
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
                      <div className="flex items-center space-x-1">
                        <Clock size={14} className="text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {formatDate(historyMenu.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-amber-400" />
                        <span className="text-sm text-gray-500">4.5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedMenuId(
                      expandedMenuId === historyMenu.id ? null : historyMenu.id
                    )}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                    title="Ver detalles"
                  >
                    <ChevronDown 
                      size={18}
                      className={`transform transition-transform ${
                        expandedMenuId === historyMenu.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => restoreMenu(historyMenu.id)}
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
                  <button
                    onClick={() => {
                      // Share menu logic
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                    title="Compartir menú"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {expandedMenuId === historyMenu.id && (
              <div className="p-4">
                <div className="grid gap-3">
                  {weekDays.map(day => {
                    const dayKey = day.toLowerCase();
                    const lunch = historyMenu[`${dayKey}_lunch` as keyof ExtendedWeeklyMenuDB];
                    const dinner = historyMenu[`${dayKey}_dinner` as keyof ExtendedWeeklyMenuDB];
                    
                    return (
                      <div key={day} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 items-center">
                        <div className="flex items-center justify-between md:justify-start space-x-2 font-medium text-gray-700 md:col-span-1">
                          <span>{day}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:col-span-5">
                          {/* Lunch */}
                          <div className="flex items-center justify-between space-x-2 bg-white rounded-lg p-2 border border-rose-100">
                            <div className="flex items-center space-x-2 min-w-0">
                              <Utensils size={16} className="text-rose-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">
                                {lunch || '-'}
                              </span>
                            </div>
                          </div>
                          {/* Dinner */}
                          <div className="flex items-center justify-between space-x-2 bg-white rounded-lg p-2 border border-rose-100">
                            <div className="flex items-center space-x-2 min-w-0">
                              <Moon size={16} className="text-rose-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">
                                {dinner || '-'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                page === pageNum
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-rose-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}