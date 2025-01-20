import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Logo container with pulsing background */}
        <div className="relative">
          <div className="absolute inset-0 bg-rose-200/20 rounded-2xl blur-xl animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-rose-100">
            <div className="relative">
              <ChefHat size={48} className="text-rose-500 animate-bounce" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 shadow-sm">
                <Sparkles size={12} className="text-rose-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 bg-orange-100/50 w-8 h-8 rounded-full blur-sm animate-pulse" />
        <div className="absolute -bottom-4 -left-4 bg-purple-100/50 w-8 h-8 rounded-full blur-sm animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Preparando tu experiencia...
        </h2>
        <p className="text-gray-500 mt-2 animate-pulse">
          Cargando ingredientes mágicos 🌟
        </p>
      </div>

      {/* Loading progress */}
      <div className="mt-6 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
} 