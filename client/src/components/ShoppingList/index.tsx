import React, { useState } from 'react';
import { Download, Filter, Share2, ShoppingCart, Calendar, CalendarDays, Users } from 'lucide-react';
import { ShoppingItem } from '../../types';
import { CategoryGroup } from './CategoryGroup';
import { Progress } from './Progress';
import { weekDays } from '../WeeklyMenu2/utils';
import { categoryOrder } from '../../data/categories';

interface ShoppingListProps {
  readonly items: ShoppingItem[];
  readonly onToggleItem: (nombre: string, dia?: string) => void;
}

type WeekDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export function ShoppingList({ items, onToggleItem }: ShoppingListProps) {
  const [showCompleted, setShowCompleted] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState<WeekDay>('Lunes');
  const [servings, setServings] = useState(2);

  const adjustedItems = items.map(item => ({
    ...item,
    cantidad: (item.quantity / 2) * servings
  }));

  const filteredItems = viewMode === 'weekly' 
    ? adjustedItems 
    : adjustedItems.filter(item => item.days.includes(selectedDay));

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    
    if (viewMode === 'daily') {
      acc[item.category].push({
        ...item,
        days: [selectedDay]
      });
    } else {
      acc[item.category].push(item);
    }
    
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const sortedCategories = categoryOrder.filter(categoria => 
    itemsByCategory[categoria] && 
    (showCompleted || itemsByCategory[categoria].some(item => !item.checked))
  );

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const completedCount = filteredItems.filter(item => item.checked).length;

  const handleExport = () => {
    const today = new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());

    const content = viewMode === 'daily'
      ? `🛒 *Lista de Compra - ${selectedDay}* (${servings} comensales)\n📅 Generada el ${today}\n\n`
      : `🛒 *Lista de Compra Semanal* (${servings} comensales)\n📅 Generada el ${today}\n\n`;

    const itemsList = sortedCategories
      .map(categoria => {
        const items = itemsByCategory[categoria];
        const itemsList = items
          .map(item => `${item.checked ? '✅' : '⬜'} ${item.name}: ${item.quantity} ${item.unit}`)
          .join('\n');
        return `*${categoria}*\n${itemsList}\n`;
      })
      .join('\n');

    const encodedMessage = encodeURIComponent(content + itemsList);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <ShoppingCart size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Lista de Compra</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              🛒 Ingredientes necesarios para tu menú
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white transition-colors border border-rose-100 shadow-sm text-sm md:text-base"
          >
            <Filter size={16} className="md:w-5 md:h-5" />
            <span>{showCompleted ? 'Ocultar comprados' : 'Mostrar todos'}</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm text-sm md:text-base"
          >
            <Share2 size={16} className="md:w-5 md:h-5" />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <Progress total={filteredItems.length} completed={completedCount} />
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100">
            <Users size={16} className="text-rose-500 md:w-5 md:h-5" />
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="bg-transparent text-gray-900 font-medium focus:outline-none text-sm md:text-base"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} comensales</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-colors text-sm md:text-base ${
              viewMode === 'weekly'
                ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white/90 border border-rose-100'
            }`}
          >
            <Calendar size={16} className="md:w-5 md:h-5" />
            <span>Semanal</span>
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-colors text-sm md:text-base ${
              viewMode === 'daily'
                ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white/90 border border-rose-100'
            }`}
          >
            <CalendarDays size={16} className="md:w-5 md:h-5" />
            <span>Diario</span>
          </button>
        </div>
      </div>

      {viewMode === 'daily' && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-none px-3 md:px-4 py-2 rounded-xl transition-colors whitespace-nowrap text-sm md:text-base ${
                selectedDay === day
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-200'
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-rose-50/50 border border-rose-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 md:space-y-4">
        {sortedCategories.map(categoria => {
          const items = itemsByCategory[categoria];
          const visibleItems = showCompleted 
            ? items 
            : items.filter(item => !item.checked);

          if (visibleItems.length === 0) return null;

          console.log('Rendering CategoryGroup:', {
            categoria,
            items: visibleItems,
            isExpanded: expandedCategories.includes(categoria)
          });

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

      {items.length === 0 && (
        <div className="text-center py-8 md:py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20">
          <div className="bg-rose-50 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <ShoppingCart size={24} className="text-rose-500 md:w-8 md:h-8" />
          </div>
          <p className="text-gray-900 font-medium">No hay ingredientes en la lista</p>
          <p className="text-sm md:text-base text-gray-500 mt-1">Añade recetas al menú semanal para generar la lista</p>
        </div>
      )}
    </div>
  );
}