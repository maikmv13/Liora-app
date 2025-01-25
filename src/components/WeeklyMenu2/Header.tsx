import React from 'react';
import { Calendar } from 'lucide-react';

export function Header() {
  return (
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
  );
}