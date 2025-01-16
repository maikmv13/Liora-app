import React from 'react';
import { Share2, Wand2, Loader2, Clock, History, Calendar } from 'lucide-react';

interface HeaderProps {
  onGenerateMenu: () => void;
  onExport: () => void;
  onToggleHistory: () => void;
  isGenerating: boolean;
  lastGenerated: string | null;
}

export function Header({ 
  onGenerateMenu, 
  onExport, 
  onToggleHistory,
  isGenerating, 
  lastGenerated 
}: HeaderProps) {
  const scrollToHistory = () => {
    // Primero intentamos encontrar el elemento por ID
    const historyElement = document.getElementById('menu-history');
    if (historyElement) {
      historyElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onToggleHistory();
  };

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
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

        {/* Botones - Desktop */}
        <div className="hidden md:flex flex-wrap gap-3">
          <button 
            onClick={onGenerateMenu}
            disabled={isGenerating}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>Generar Menú</span>
              </>
            )}
          </button>
          <button 
            onClick={onExport}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
          <button 
            onClick={scrollToHistory}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <History size={20} />
            <span>Historial</span>
          </button>
        </div>

        {/* Botones - Mobile */}
        <div className="flex md:hidden flex-col w-full gap-2">
          <button 
            onClick={onGenerateMenu}
            disabled={isGenerating}
            className={`flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>Generar Menú</span>
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={scrollToHistory}
              className="flex items-center justify-center space-x-2 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm text-sm"
            >
              <History size={16} />
              <span>Historial</span>
            </button>
            <button 
              onClick={onExport}
              className="flex items-center justify-center space-x-2 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm text-sm"
            >
              <Share2 size={16} />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Última generación */}
      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Clock size={16} className="text-rose-400" />
          <span>Último menú generado: {lastGenerated}</span>
        </div>
      )}
    </div>
  );
}