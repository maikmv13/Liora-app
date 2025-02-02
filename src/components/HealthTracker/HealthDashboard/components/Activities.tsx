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

  // Obtener meses únicos
  const months = [...new Set(entries.map(entry => 
    new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  ))];

  // Filtrar entradas
  const filteredEntries = entries.filter(entry => {
    const matchesMonth = selectedMonth 
      ? new Date(entry.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) === selectedMonth 
      : true;
    const matchesSearch = JSON.stringify(entry).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  // Agrupar entradas por fecha
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

  const getActivityIcon = (entry: typeof entries[0]) => {
    if (entry.weight) return <Scale className="w-5 h-5 text-rose-500" />;
    if (entry.amount) return <Droplets className="w-5 h-5 text-blue-500" />;
    if (entry.duration) return <Dumbbell className="w-5 h-5 text-emerald-500" />;
    return <Activity className="w-5 h-5 text-gray-500" />;
  };

  const getActivityDescription = (entry: typeof entries[0]) => {
    if (entry.weight) return `Registro de peso: ${entry.weight} kg`;
    if (entry.amount) return `Ingesta de agua: ${entry.amount} ml`;
    if (entry.duration) return `${entry.duration} minutos de ${entry.type || 'ejercicio'}${entry.exercise ? `: ${entry.exercise}` : ''}`;
    return 'Actividad';
  };

  const getActivityColor = (entry: typeof entries[0]) => {
    if (entry.weight) return 'bg-rose-50 text-rose-600';
    if (entry.amount) return 'bg-blue-50 text-blue-600';
    if (entry.duration) return 'bg-emerald-50 text-emerald-600';
    return 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      {/* Header con gradiente */}
      <div className="relative p-6 bg-gradient-to-br from-violet-600 to-indigo-700">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Contenido del header */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Historial de Actividades</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs text-indigo-200">
                    {filteredEntries.length} actividades registradas
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Panel de filtros */}
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

      {/* Lista de actividades */}
      <div className="divide-y divide-gray-100">
        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <div key={date} className="p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-violet-500" />
              <h4 className="font-medium text-gray-900">{date}</h4>
            </div>
            <div className="space-y-3">
              {dayEntries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(entry)}`}>
                    {getActivityIcon(entry)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityDescription(entry)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <Star className="w-4 h-4 text-amber-400 ml-auto" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No se encontraron actividades</p>
          </div>
        )}
      </div>

      {/* Footer con resumen */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          {filteredEntries.length} actividad{filteredEntries.length !== 1 ? 'es' : ''} encontrada{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}