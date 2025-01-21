import React, { useState } from 'react';
import { Activity, Scale, Droplets, Dumbbell, Calendar, Search, Filter, ChevronDown, TrendingUp, Trophy, Target } from 'lucide-react';

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

  // Calcular estadísticas generales
  const stats = {
    weight: {
      total: entries.filter(e => e.weight).length,
      average: entries.filter(e => e.weight).reduce((acc, curr) => acc + (curr.weight || 0), 0) / entries.filter(e => e.weight).length || 0,
      lastEntry: entries.find(e => e.weight)?.weight || 0
    },
    water: {
      total: entries.filter(e => e.amount).length,
      average: entries.filter(e => e.amount).reduce((acc, curr) => acc + (curr.amount || 0), 0) / entries.filter(e => e.amount).length || 0,
      lastEntry: entries.find(e => e.amount)?.amount || 0
    },
    exercise: {
      total: entries.filter(e => e.duration).length,
      totalMinutes: entries.filter(e => e.duration).reduce((acc, curr) => acc + (curr.duration || 0), 0),
      averageMinutes: entries.filter(e => e.duration).reduce((acc, curr) => acc + (curr.duration || 0), 0) / entries.filter(e => e.duration).length || 0
    }
  };

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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-violet-100">
      {/* Estadísticas generales */}
      <div className="p-6 border-b border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-gray-900">Resumen de actividades</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estadísticas de peso */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Scale className="w-5 h-5 text-rose-500" />
              <h4 className="font-medium text-gray-900">Control de peso</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registros totales:</span>
                <span className="font-medium text-gray-900">{stats.weight.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Peso promedio:</span>
                <span className="font-medium text-gray-900">{stats.weight.average.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Último registro:</span>
                <span className="font-medium text-gray-900">{stats.weight.lastEntry} kg</span>
              </div>
            </div>
          </div>

          {/* Estadísticas de agua */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900">Hidratación</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registros totales:</span>
                <span className="font-medium text-gray-900">{stats.water.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promedio diario:</span>
                <span className="font-medium text-gray-900">{Math.round(stats.water.average)} ml</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Último registro:</span>
                <span className="font-medium text-gray-900">{stats.water.lastEntry} ml</span>
              </div>
            </div>
          </div>

          {/* Estadísticas de ejercicio */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Dumbbell className="w-5 h-5 text-emerald-500" />
              <h4 className="font-medium text-gray-900">Ejercicio</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sesiones totales:</span>
                <span className="font-medium text-gray-900">{stats.exercise.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Minutos totales:</span>
                <span className="font-medium text-gray-900">{stats.exercise.totalMinutes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promedio por sesión:</span>
                <span className="font-medium text-gray-900">{Math.round(stats.exercise.averageMinutes)} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de actividades */}
      <div className="p-4 border-b border-violet-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-violet-500" />
            <h3 className="font-semibold text-gray-900">Historial</h3>
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
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">Todos los meses</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="divide-y divide-violet-100">
        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <div key={date} className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">{date}</h4>
            <div className="space-y-3">
              {dayEntries.map((entry, index) => (
                <div key={index} className="flex items-center space-x-3">
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
                </div>
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

      {/* Pie con resumen */}
      <div className="p-4 border-t border-violet-100 bg-gray-50">
        <p className="text-sm text-gray-600">
          {filteredEntries.length} actividad{filteredEntries.length !== 1 ? 'es' : ''} encontrada{filteredEntries.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}