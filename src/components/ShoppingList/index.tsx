import React from 'react';
import { Filter, Share2, ShoppingCart, Calendar, CalendarDays, Users } from 'lucide-react';
import { ShoppingItem } from '../../types';
import { CategoryGroup } from './components/CategoryGroup';
import { Progress } from './components/Progress';
import { EmptyState } from './components/EmptyState';
import { weekDays } from '../WeeklyMenu2/utils';
import { useShoppingListState } from './hooks/useShoppingListState';
import { filterAndSortItems, generateExportContent } from './utils/listUtils';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { useShoppingList } from '../../hooks/useShoppingList';
import { ShoppingListSkeleton } from './components/ShoppingListSkeleton';

interface ShoppingListProps {
  readonly items: ShoppingItem[];
  readonly onToggleItem: (nombre: string, dia?: string, cantidad?: number) => void;
}

export function ShoppingList({ items, onToggleItem }: ShoppingListProps) {
  const { id: userId, isHousehold } = useActiveProfile();
  const { shoppingList, loading, toggleItem } = useShoppingList(userId, isHousehold);

  const {
    showCompleted,
    setShowCompleted,
    expandedCategories,
    setExpandedCategories,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    servings,
    setServings,
  } = useShoppingListState();

  const { itemsByCategory, sortedCategories, filteredItems } = filterAndSortItems(
    shoppingList,
    viewMode,
    selectedDay,
    servings,
    showCompleted
  );

  const completedCount = filteredItems.filter(item => item.checked).length;
  const totalCount = filteredItems.length;

  const handleExport = () => {
    const content = generateExportContent(
      sortedCategories,
      itemsByCategory,
      viewMode,
      selectedDay,
      servings
    );
    const encodedMessage = encodeURIComponent(content);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const handleToggleItem = (nombre: string, cantidad?: number) => {
    // Si estamos en vista diaria, la cantidad será la porción diaria
    if (viewMode === 'daily') {
      const item = items.find(i => i.name === nombre);
      if (item) {
        // Calcular la cantidad diaria basada en los días totales
        const diasTotales = item.days.length;
        const cantidadDiaria = item.quantity / diasTotales;
        onToggleItem(nombre, selectedDay, cantidad || cantidadDiaria);
      }
    } else {
      // En vista semanal, toggle normal
      onToggleItem(nombre);
    }
  };

  // Loading state
  if (loading) {
    return <ShoppingListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="w-full">
        {!loading && filteredItems.length > 0 && (
          <Progress total={filteredItems.length} completed={completedCount} />
        )}
      </div>

      {/* Controles de vista y filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Selector de comensales - ocupa 2 columnas en mobile */}
        <div className="col-span-2 flex items-center space-x-2 px-3 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100">
          <Users size={16} className="text-rose-500" />
          <select
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} comensales</option>
            ))}
          </select>
        </div>

        {/* Botones de vista */}
        <button
          onClick={() => setViewMode('weekly')}
          className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl transition-colors ${
            viewMode === 'weekly'
              ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100'
          }`}
        >
          <Calendar size={16} />
          <span>Semanal</span>
        </button>

        <button
          onClick={() => setViewMode('daily')}
          className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl transition-colors ${
            viewMode === 'daily'
              ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100'
          }`}
        >
          <CalendarDays size={16} />
          <span>Diario</span>
        </button>

        {/* Botón de filtro - ocupa 2 columnas en mobile */}
        <button 
          onClick={() => setShowCompleted(!showCompleted)}
          className={`col-span-2 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl transition-colors ${
            showCompleted
              ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100'
          }`}
        >
          <Filter size={16} />
          <span>{showCompleted ? 'Mostrar todos' : 'Ocultar comprados'}</span>
        </button>
      </div>

      {/* Lista de compra */}
      {loading ? (
        <ShoppingListSkeleton />
      ) : filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Categorías y items */}
          <div className="space-y-4">
            {sortedCategories.map(category => (
              <CategoryGroup
                key={category}
                category={category}
                items={itemsByCategory[category]}
                expanded={expandedCategories.includes(category)}
                onToggleExpand={() => toggleCategory(category)}
                onToggleItem={toggleItem}
                viewMode={viewMode}
                selectedDay={selectedDay}
              />
            ))}
          </div>

          {/* Botón de compartir al final */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm"
            >
              <Share2 size={20} />
              <span className="font-medium">Compartir lista</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingList;