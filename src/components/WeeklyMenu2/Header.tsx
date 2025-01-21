import React from 'react';
import { Calendar } from 'lucide-react';

interface HeaderProps {
  className?: string;
  lastGenerated: string | null;
}

export function Header({ lastGenerated }: HeaderProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex items-center space-x-3">
        <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
          <Calendar size={24} className="text-rose-500 md:w-7 md:h-7" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Menú Semanal</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            📅 Planifica tus comidas para la semana
          </p>
        </div>
      </div>

      {/* Última generación */}
      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Calendar size={16} className="text-rose-400" />
          <span>Último menú generado: {formatDate(lastGenerated)}</span>
        </div>
      )}
    </div>
  );
}