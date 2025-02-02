import React, { useState } from 'react';
import { Activity, Scale, Droplets, Dumbbell, Calendar, Search, Filter, ChevronDown, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivitiesProps {
  entries: Array<{
    date: string;
    weight?: number;
    amount?: number;
    duration?: number;
    type?: string;
    exercise?: string;
  }>;
}

export function Activities({ entries }: ActivitiesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique months
  const months = [...new Set(entries.map(entry => 
    new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  ))];

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesMonth = selectedMonth 
      ? new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) === selectedMonth 
      : true;
    const matchesSearch = JSON.stringify(entry).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/20 overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-600/80 to-teal-800/90" />
          
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
                <Activity className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Historial de Ejercicios</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="text-sm text-emerald-100">
                    {filteredEntries.length} actividades registradas
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
                  placeholder="Buscar actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">Todos los meses</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-emerald-100/10">
        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 hover:bg-emerald-50/50 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <h4 className="font-medium text-gray-900">{date}</h4>
            </div>
            <div className="space-y-3">
              {dayEntries.map((entry, index) => {
                const duration = entry.duration;
                if (!duration) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Dumbbell className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">
                          {entry.exercise || 'Ejercicio'}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-emerald-600 font-medium">
                            {duration} min
                          </span>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="text-gray-500">No se encontraron actividades</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-emerald-50/50 border-t border-emerald-100/20">
        <p className="text-sm text-emerald-600">
          {filteredEntries.length} actividad{filteredEntries.length !== 1 ? 'es' : ''} encontrada{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}