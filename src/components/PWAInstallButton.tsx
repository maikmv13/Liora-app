import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallButtonProps {
  onInstall?: () => void;
}

export function PWAInstallButton({ onInstall }: PWAInstallButtonProps) {
  const { isInstallable, installPWA } = usePWA();

  if (!isInstallable) return null;

  const handleInstall = async () => {
    try {
      await installPWA();
      onInstall?.();
    } catch (error) {
      console.error('Error al instalar la PWA:', error);
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center justify-between px-4 py-3 transition-colors text-gray-700 hover:bg-rose-50"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-50">
          <Smartphone size={18} className="text-gray-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium">Instalar App</span>
          <span className="text-xs text-gray-500">
            Instalar MiCocina en tu dispositivo
          </span>
        </div>
      </div>
      <Download size={18} className="text-gray-400" />
    </button>
  );
}