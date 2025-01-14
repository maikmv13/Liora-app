import React from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { ShoppingItem } from '../../../types';
import { ShoppingItemRow } from './ShoppingItemRow';
import { getCategoryIcon } from '../utils/categoryIcons';

interface CategoryGroupProps {
  categoria: string;
  items: ShoppingItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (nombre: string) => void;
}

// Define weekday order for sorting
const weekDayOrder = {
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6,
  'Domingo': 7
};

export function CategoryGroup({ 
  categoria, 
  items, 
  isExpanded, 
  onToggleExpand,
  onToggleItem 
}: CategoryGroupProps) {
  const completedCount = items.filter(item => item.checked).length;
  const isAllCompleted = completedCount === items.length;
  const CategoryIcon = getCategoryIcon(categoria);

  // Sort items chronologically by days
  const sortedItems = [...items].sort((a, b) => {
    // Get the earliest day for each item
    const earliestDayA = a.days.reduce((earliest, day) => {
      const dayOrder = weekDayOrder[day as keyof typeof weekDayOrder] || 999;
      return dayOrder < earliest ? dayOrder : earliest;
    }, 999);

    const earliestDayB = b.days.reduce((earliest, day) => {
      const dayOrder = weekDayOrder[day as keyof typeof weekDayOrder] || 999;
      return dayOrder < earliest ? dayOrder : earliest;
    }, 999);

    // Sort by earliest day first
    if (earliestDayA !== earliestDayB) {
      return earliestDayA - earliestDayB;
    }

    // If days are the same, sort by name
    return a.name.localeCompare(b.name);
  });

  const handleToggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If all items are checked, uncheck all. Otherwise, check all
    sortedItems.forEach(item => {
      if (isAllCompleted || !item.checked) {
        onToggleItem(item.name);
      }
    });
  };

  return (
    <div className={`
      bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border transition-colors duration-300
      ${isAllCompleted 
        ? 'border-emerald-200 bg-emerald-50/50' 
        : 'border-rose-100/20'
      }
    `}>
      {/* Category Header */}
      <div className="flex items-center justify-between p-2.5 md:p-4">
        {/* Category Info */}
        <div 
          className={`
            flex items-center space-x-3 flex-1 cursor-pointer
            ${isAllCompleted 
              ? 'hover:bg-emerald-50/80' 
              : 'hover:bg-rose-50/50'
            }
          `}
          onClick={onToggleExpand}
        >
          <div className={`
            p-2 rounded-xl transition-colors
            ${isAllCompleted 
              ? 'bg-emerald-100 text-emerald-600' 
              : 'bg-rose-50 text-rose-500'
            }
          `}>
            <CategoryIcon size={20} />
          </div>
          <div>
            <h3 className={`
              font-medium text-sm md:text-base
              ${isAllCompleted ? 'text-emerald-800' : 'text-gray-900'}
            `}>
              {categoria}
            </h3>
            <p className="text-xs text-gray-500">
              {completedCount} de {items.length} items
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Toggle All Button */}
          <button
            onClick={handleToggleAll}
            className={`
              p-1.5 rounded-lg border transition-colors
              ${isAllCompleted
                ? 'bg-emerald-100 border-emerald-200 text-emerald-600 hover:bg-emerald-200'
                : 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100'
              }
            `}
            aria-label={isAllCompleted ? 'Desmarcar todo' : 'Marcar todo'}
          >
            <Check size={16} className={isAllCompleted ? 'opacity-100' : 'opacity-50'} />
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className={`
              p-1.5 rounded-lg transition-colors
              ${isAllCompleted ? 'text-emerald-600' : 'text-rose-400'}
            `}
            aria-label={isExpanded ? 'Contraer categoría' : 'Expandir categoría'}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Items List */}
      {isExpanded && (
        <div className="divide-y divide-rose-100/20">
          {sortedItems.map((item) => (
            <ShoppingItemRow
              key={`${item.name}-${item.days.join('-')}`}
              item={item}
              onToggle={() => onToggleItem(item.name)}
              isGroupCompleted={isAllCompleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}