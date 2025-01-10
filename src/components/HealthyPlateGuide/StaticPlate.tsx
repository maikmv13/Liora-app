import React from 'react';
import { Carrot, Fish, Wheat } from 'lucide-react';

export function StaticPlate() {
  return (
    <div className="relative max-w-4xl mx-auto pt-20 pb-32">
      {/* Plato principal */}
      <div className="relative aspect-square max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] border-8 border-gray-100">
          {/* Divisiones del plato */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Líneas divisorias */}
            <path
              d="M50,0 L50,100 M50,50 L100,50"
              className="stroke-white stroke-[3]"
              strokeLinecap="round"
              fill="none"
            />

            {/* Verduras (50%) */}
            <path
              d="M0,0 L50,0 L50,50 L0,50 Z"
              className="bg-emerald-500 fill-emerald-500 opacity-90"
            />

            {/* Proteínas (25%) */}
            <path
              d="M50,50 L100,50 L100,100 L50,100 Z"
              className="bg-rose-500 fill-rose-500 opacity-90"
            />

            {/* Carbohidratos (25%) */}
            <path
              d="M50,0 L100,0 L100,50 L50,50 Z"
              className="bg-amber-500 fill-amber-500 opacity-90"
            />
          </svg>

          {/* Etiquetas permanentes */}
          <div className="absolute top-[25%] left-[10%]">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 border-emerald-200">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Carrot className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Verduras</p>
                <p className="text-sm text-emerald-500">50%</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[25%] right-[10%]">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 border-rose-200">
              <div className="p-2 rounded-lg bg-rose-100">
                <Fish className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Proteínas</p>
                <p className="text-sm text-rose-500">25%</p>
              </div>
            </div>
          </div>

          <div className="absolute top-[25%] right-[10%]">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 border-amber-200">
              <div className="p-2 rounded-lg bg-amber-100">
                <Wheat className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Carbohidratos</p>
                <p className="text-sm text-amber-500">25%</p>
              </div>
            </div>
          </div>

          {/* Borde decorativo y sombra interior */}
          <div className="absolute inset-0 rounded-full border-8 border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
          
          {/* Centro del plato */}
          <div className="absolute inset-[15%] rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-4 border-gray-50 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
                <Carrot className="w-6 h-6 text-rose-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Método del Plato
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}