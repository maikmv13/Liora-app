import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, Search, Filter, ChevronDown, Trash2, Clock } from 'lucide-react';

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightHistoryProps {
  entries: WeightEntry[];
  onDelete: (date: string) => void;
}

export function WeightHistory({ entries, onDelete }: WeightHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const months = [...new Set(entries.map(entry => 
    new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  ))];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.weight.toString().includes(searchTerm);
    const matchesMonth = selectedMonth ? 
      new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) === selectedMonth : 
      true;
    return matchesSearch && matchesMonth;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleDelete = (date: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      onDelete(date);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Encabezado con búsqueda y filtros */}
      <div className="p-4 border-b border-rose-100/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-gray-900">Historial de registros</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Filter size={16} />
            <span>Filtros</span>
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por peso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="">Todos los meses</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de registros */}
      <div className="divide-y divide-rose-100/10">
        {sortedEntries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No se encontraron registros</p>
            <p className="text-sm mt-1">Ajusta los filtros para ver más resultados</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {sortedEntries.map((entry, index) => {
              const prevWeight = index < entries.length - 1 ? entries[index + 1].weight : entry.weight;
              const change = entry.weight - prevWeight;
              const isGaining = change > 0;
              const date = new Date(entry.date);

              return (
                <div 
                  key={entry.date}
                  className="group hover:bg-rose-50/50 transition-colors"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isGaining ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {isGaining ? (
                          <TrendingUp className="w-5 h-5 text-red-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {entry.weight} kg
                          </span>
                          {index < entries.length - 1 && (
                            <span className={`text-sm font-medium ${
                              isGaining ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {isGaining ? '+' : ''}{change.toFixed(1)} kg
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>
                            {date.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.date)}
                      className="p-2 text-gray-400 hover:text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Eliminar registro"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pie con resumen */}
      <div className="p-4 border-t border-rose-100/20 bg-gray-50">
        <p className="text-sm text-gray-600">
          {filteredEntries.length} registro{filteredEntries.length !== 1 ? 's' : ''} encontrado{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}