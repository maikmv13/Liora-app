import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallButtonProps {
  onInstall?: () => void;
}

export function PWAInstallButton({ onInstall }: PWAInstallButtonProps) {
  const { isInstallable, installPWA } = usePWA();

  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const hasShownInstall = localStorage.getItem('hasShownInstall');
    setChecked(true);
    if (!hasShownInstall) {
      localStorage.setItem('hasShownInstall', 'true');
    }
  }, []);

  if (!checked || !isInstallable) return null;

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
      className="w-full flex items-center justify-between px-4 py-3 transition-colors text-gray-700 hover:bg-rose-50 relative"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-rose-50">
          <Smartphone size={18} className="text-rose-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium">Instalar App</span>
          <span className="text-xs text-gray-500">
            Instalar MiCocina en tu dispositivo
          </span>
        </div>
      </div>
      <Download size={18} className="text-rose-400" />
      
      <span className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded-full">
        Nuevo
      </span>
    </button>
  );
}