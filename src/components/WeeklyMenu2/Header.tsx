import React from 'react';
import { Share2, Wand2, Loader2, Clock } from 'lucide-react';

interface HeaderProps {
  onGenerateMenu: () => void;
  onExport: () => void;
  isGenerating: boolean;
  lastGenerated: string | null;
}

export function Header({ onGenerateMenu, onExport, isGenerating, lastGenerated }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Menú Semanal</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">Planifica tus comidas para la semana</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onGenerateMenu}
            disabled={isGenerating}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
              isGenerating
                ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white hover:from-orange-500 hover:via-pink-600 hover:to-rose-600'
            }`}
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Wand2 size={20} />
            )}
            <span>{isGenerating ? 'Generando...' : 'Generar Menú'}</span>
          </button>
          <button 
            onClick={onExport}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Clock size={16} className="text-rose-400" />
          <span>Último menú generado: {lastGenerated}</span>
        </div>
      )}
    </div>
  );
}