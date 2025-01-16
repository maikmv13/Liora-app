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
  viewMode: 'weekly' | 'daily';
  selectedDay?: string;
}

export function CategoryGroup({ 
  categoria, 
  items, 
  isExpanded, 
  onToggleExpand,
  onToggleItem,
  viewMode,
  selectedDay
}: CategoryGroupProps) {
  const completedCount = items.filter(item => item.checked).length;
  const isAllCompleted = completedCount === items.length;
  const CategoryIcon = getCategoryIcon(categoria);

  const handleToggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    items.forEach(item => {
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
          {items.map((item) => (
            <ShoppingItemRow
              key={`${item.name}-${item.days.join('-')}`}
              item={item}
              onToggle={() => onToggleItem(item.name)}
              isGroupCompleted={isAllCompleted}
              viewMode={viewMode}
              selectedDay={selectedDay}
            />
          ))}
        </div>
      )}
    </div>
  );
}