import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-8 md:py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20">
      <div className="bg-rose-50 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
        <ShoppingCart size={24} className="text-rose-500 md:w-8 md:h-8" />
      </div>
      <p className="text-gray-900 font-medium">No hay ingredientes en la lista</p>
      <p className="text-sm md:text-base text-gray-500 mt-1">Añade recetas al menú semanal para generar la lista</p>
    </div>
  );
}