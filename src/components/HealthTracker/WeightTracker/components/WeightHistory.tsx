import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, Search, Filter, ChevronDown, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-rose-600/80 to-pink-800/90" />
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Calendar className="w-5 h-5 text-orange-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Historial de Peso</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <Clock className="w-3.5 h-3.5 text-orange-200" />
                  <span className="text-sm text-orange-100">
                    {filteredEntries.length} registros guardados
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors text-white border border-white/20"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Buscar por peso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="">Todos los meses</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lista de registros */}
      <div className="divide-y divide-rose-100/10">
        {sortedEntries.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-rose-300" />
            <p className="font-medium text-gray-600">No se encontraron registros</p>
            <p className="text-sm text-gray-500 mt-1">Ajusta los filtros para ver más resultados</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {sortedEntries.map((entry, index) => {
              const prevWeight = index < entries.length - 1 ? entries[index + 1].weight : entry.weight;
              const change = entry.weight - prevWeight;
              const isGaining = change > 0;
              const date = new Date(entry.date);

              return (
                <motion.div 
                  key={entry.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-rose-100/20 bg-rose-50/50">
        <p className="text-sm text-rose-600">
          {filteredEntries.length} registro{filteredEntries.length !== 1 ? 's' : ''} encontrado{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}