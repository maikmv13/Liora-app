import React from 'react';
import { Download, Apple, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallButtonProps {
  onInstall?: () => void;
}

export function PWAInstallButton({ onInstall }: PWAInstallButtonProps) {
  const { isInstallable, isIOS, installPWA } = usePWA();

  if (!isInstallable && !isIOS) return null;

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS installation instructions
      alert('Para instalar la app:\n1. Toca el botón Compartir\n2. Selecciona "Añadir a pantalla de inicio"');
    } else {
      await installPWA();
    }
    onInstall?.();
  };

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center justify-between px-4 py-3 transition-colors text-gray-700 hover:bg-rose-50"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-50">
          {isIOS ? (
            <Apple size={18} className="text-gray-500" />
          ) : (
            <Smartphone size={18} className="text-gray-500" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium">Descargar App</span>
          <span className="text-xs text-gray-500">
            {isIOS ? 'Instalar en iOS' : 'Instalar aplicación'}
          </span>
        </div>
      </div>
      <Download size={18} className="text-gray-400" />
    </button>
  );
}