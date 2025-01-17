import React from 'react';
import { ShoppingItem } from '../../../types';
import { getUnitPlural } from '../../../utils/getUnitPlural';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: () => void;
  isGroupCompleted: boolean;
  viewMode: 'weekly' | 'daily';
  selectedDay?: string;
}

export function ShoppingItemRow({ 
  item, 
  onToggle, 
  isGroupCompleted, 
  viewMode,
  selectedDay 
}: ShoppingItemRowProps) {
  // Obtener la cantidad correcta según el modo de vista
  const getDisplayQuantity = () => {
    if (viewMode === 'daily' && selectedDay && item.dailyQuantities) {
      return item.dailyQuantities[selectedDay] || 0;
    }
    return item.quantity;
  };

  const quantity = getDisplayQuantity();
  const unit = getUnitPlural(item.unit, quantity);

  return (
    <div className={`
      flex items-center justify-between p-2.5 md:p-4 transition-colors group
      ${isGroupCompleted 
        ? 'hover:bg-emerald-50/80' 
        : 'hover:bg-rose-50/50'
      }
    `}>
      <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={`
            w-4 h-4 md:w-5 md:h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0
            ${item.checked
              ? isGroupCompleted
                ? 'bg-emerald-500 border-transparent text-white'
                : 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 border-transparent text-white'
              : isGroupCompleted
                ? 'border-emerald-200 group-hover:border-emerald-400'
                : 'border-rose-200 group-hover:border-rose-400'
            }
          `}
        >
          {item.checked && (
            <svg className="w-2.5 h-2.5 md:w-3 md:h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <span className={`
            text-sm md:text-base block truncate
            ${item.checked 
              ? 'text-gray-400 line-through' 
              : isGroupCompleted
                ? 'text-emerald-900'
                : 'text-gray-900'
            }
          `}>
            {item.name}
          </span>
          {viewMode === 'weekly' && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {item.days.map(dia => (
                <span key={dia} className={`
                  text-[10px] md:text-xs px-1.5 py-0.5 rounded
                  ${isGroupCompleted
                    ? 'text-emerald-600 bg-emerald-100'
                    : 'text-gray-500 bg-gray-100'
                  }
                `}>
                  {dia}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className={`
        text-xs md:text-sm ml-2 flex-shrink-0
        ${item.checked ? 'text-gray-400' : isGroupCompleted ? 'text-emerald-700' : 'text-gray-600'}
      `}>
        {quantity.toFixed(1)} {unit}
      </span>
    </div>
  );
}