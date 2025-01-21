import React from 'react';
import { X, Calendar, Search, Filter, ChevronDown, Droplets } from 'lucide-react';
import type { WaterEntry } from './types';

interface WaterHistoryProps {
  entries: WaterEntry[];
  dailyGoal: number;
  onClose: () => void;
}

export function WaterHistory({ entries, dailyGoal, onClose }: WaterHistoryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState('');

  const months = [...new Set(entries.map(entry => 
    new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  ))];

  const filteredEntries = entries.filter(entry => {
    const matchesMonth = selectedMonth 
      ? new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) === selectedMonth 
      : true;
    const matchesSearch = entry.amount.toString().includes(searchTerm);
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Historial de hidratación</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cantidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los meses</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {filteredEntries.map((entry) => {
              const date = new Date(entry.date);
              const progress = (entry.amount / dailyGoal) * 100;

              return (
                <div key={entry.date} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        progress >= 100
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-400'
                          : progress >= 50
                          ? 'bg-gradient-to-br from-blue-400 to-cyan-400'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <Droplets className={`w-6 h-6 ${
                          progress >= 50 ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {entry.amount} ml
                          </span>
                          <span className={`text-sm font-medium ${
                            progress >= 100
                              ? 'text-emerald-500'
                              : progress >= 50
                              ? 'text-blue-500'
                              : 'text-gray-500'
                          }`}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {date.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600">
            {filteredEntries.length} registro{filteredEntries.length !== 1 ? 's' : ''} encontrado{filteredEntries.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}