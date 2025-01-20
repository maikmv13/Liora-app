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
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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

        {/* Botones compactos - Desktop y Mobile */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={onGenerateMenu}
            disabled={isGenerating}
            className={`
              flex items-center justify-center space-x-2 px-4 py-2.5 
              bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 
              text-white rounded-xl shadow-sm flex-1 md:flex-none
              ${isGenerating 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-orange-500 hover:via-pink-600 hover:to-rose-600'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm md:text-base">Generando...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span className="text-sm md:text-base">Generar</span>
              </>
            )}
          </button>

          <button 
            onClick={scrollToHistory}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl border border-rose-100 shadow-sm flex-1 md:flex-none hover:bg-white"
          >
            <History size={18} />
            <span className="text-sm md:text-base">Historial</span>
          </button>

          <button 
            onClick={onExport}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl border border-rose-100 shadow-sm flex-1 md:flex-none hover:bg-white"
          >
            <Share2 size={18} />
            <span className="text-sm md:text-base">Compartir</span>
          </button>
        </div>
      </div>

      {/* Última generación */}
      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Clock size={16} className="text-rose-400" />
          <span>Último menú generado: {formatDate(lastGenerated)}</span>
        </div>
      )}
    </div>
  );
}