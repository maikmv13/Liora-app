import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ShoppingItem } from '../../types';

interface CategoryGroupProps {
  categoria: string;
  items: ShoppingItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleItem: (nombre: string) => void;
}

export function CategoryGroup({ 
  categoria, 
  items, 
  isExpanded, 
  onToggleExpand,
  onToggleItem 
}: CategoryGroupProps) {
  const completedCount = items.filter(item => item.comprado).length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-rose-100/20">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-2.5 md:p-4 hover:bg-rose-50/50 transition-colors"
      >
        <div>
          <h3 className="font-medium text-gray-900 text-sm md:text-base">{categoria}</h3>
          <p className="text-xs text-gray-500">
            {completedCount} de {items.length} items
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-rose-400" />
        ) : (
          <ChevronDown size={18} className="text-rose-400" />
        )}
      </button>

      {isExpanded && (
        <div className="divide-y divide-rose-100/20">
          {items.map((item) => (
            <div
              key={`${item.nombre}-${item.dias.join('-')}`}
              className="flex items-center justify-between p-2.5 md:p-4 hover:bg-rose-50/50 transition-colors group"
            >
              <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleItem(item.nombre)}
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                    item.comprado
                      ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 border-transparent text-white'
                      : 'border-rose-200 group-hover:border-rose-400'
                  }`}
                >
                  {item.comprado && (
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
                  <span className={`text-sm md:text-base block truncate ${item.comprado ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {item.nombre}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {item.dias.map(dia => (
                      <span key={dia} className="text-[10px] md:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {dia}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className={`text-xs md:text-sm ml-2 flex-shrink-0 ${item.comprado ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.cantidad} {item.unidad}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}