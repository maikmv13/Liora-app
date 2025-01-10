import React from 'react';
import { Download, Wand2, Loader2 } from 'lucide-react';

interface HeaderProps {
  onGenerateMenu: () => void;
  onExport: () => void;
  isGenerating: boolean;
}

export function Header({ onGenerateMenu, onExport, isGenerating }: HeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Menú Semanal</h2>
        <p className="text-gray-600 mt-1">Planifica tus comidas para la semana</p>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={onGenerateMenu}
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isGenerating
              ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
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
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <Download size={20} />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
}