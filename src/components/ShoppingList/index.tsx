import React, { useState } from 'react';
import { Download, Filter, Share2, ShoppingCart, Calendar, CalendarDays, Users } from 'lucide-react';
import { ShoppingItem } from '../../types';
import { CategoryGroup } from './CategoryGroup';
import { Progress } from './Progress';
import { weekDays } from '../WeeklyMenu2/utils';
import { categoryOrder } from '../../data/categories';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (nombre: string, dia?: string) => void;
}

export function ShoppingList({ items, onToggleItem }: ShoppingListProps) {
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [servings, setServings] = useState(2);

  // Ajustar cantidades según el número de comensales
  const adjustedItems = items.map(item => ({
    ...item,
    cantidad: (item.cantidad / 2) * servings
  }));

  // Filtrar items según el modo de vista
  const filteredItems = viewMode === 'weekly' 
    ? adjustedItems 
    : adjustedItems.filter(item => item.dias.includes(selectedDay));

  // Agrupar items por categoría
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    
    if (viewMode === 'daily') {
      acc[item.categoria].push({
        ...item,
        dias: [selectedDay]
      });
    } else {
      acc[item.categoria].push(item);
    }
    
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const sortedCategories = categoryOrder.filter(categoria => 
    itemsByCategory[categoria] && 
    (showCompleted || itemsByCategory[categoria].some(item => !item.comprado))
  );

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const completedCount = filteredItems.filter(item => item.comprado).length;

  const handleExport = () => {
    const content = `🛒 *Lista de Compra (${servings} comensales)*\n\n` + sortedCategories
      .map(categoria => {
        const items = itemsByCategory[categoria];
        const itemsList = items
          .map(item => `${item.comprado ? '✅' : '⬜'} ${item.nombre}: ${item.cantidad} ${item.unidad}`)
          .join('\n');
        return `*${categoria}*\n${itemsList}\n`;
      })
      .join('\n');

    const encodedMessage = encodeURIComponent(content);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Lista de Compra</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Ingredientes necesarios para tu menú semanal</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
            >
              <Filter size={20} />
              <span>{showCompleted ? 'Ocultar comprados' : 'Mostrar todos'}</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm"
            >
              <Share2 size={20} />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Progress total={filteredItems.length} completed={completedCount} />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 sm:flex-none flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100">
              <Users size={20} className="text-rose-500" />
              <select
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="bg-transparent text-gray-900 font-medium focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} comensales</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white/90 border border-rose-100'
              }`}
            >
              <Calendar size={20} />
              <span>Semanal</span>
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
                viewMode === 'daily'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white/90 border border-rose-100'
              }`}
            >
              <CalendarDays size={20} />
              <span>Diario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selector de días para vista diaria */}
      {viewMode === 'daily' && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-none px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-rose-50/50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Lista de items */}
      <div className="space-y-4">
        {sortedCategories.map(categoria => {
          const items = itemsByCategory[categoria];
          const visibleItems = showCompleted 
            ? items 
            : items.filter(item => !item.comprado);

          if (visibleItems.length === 0) return null;

          return (
            <CategoryGroup
              key={categoria}
              categoria={categoria}
              items={visibleItems}
              isExpanded={expandedCategories.includes(categoria)}
              onToggleExpand={() => toggleCategory(categoria)}
              onToggleItem={(nombre) => onToggleItem(nombre, viewMode === 'daily' ? selectedDay : undefined)}
            />
          );
        })}
      </div>

      {/* Estado vacío */}
      {items.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} className="text-rose-500" />
          </div>
          <p className="text-gray-900 font-medium">No hay ingredientes en la lista</p>
          <p className="text-gray-500 text-sm mt-1">Añade recetas al menú semanal para generar la lista</p>
        </div>
      )}
    </div>
  );
}