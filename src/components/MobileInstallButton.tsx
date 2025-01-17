import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface MobileInstallButtonProps {
  onInstall?: () => void;
}

export function MobileInstallButton({ onInstall }: MobileInstallButtonProps) {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Verificar si el banner fue descartado en esta sesión
    const dismissed = sessionStorage.getItem('installBannerDismissed') === 'true';
    setIsDismissed(dismissed);

    // Mostrar el botón solo si:
    // 1. La app es instalable
    // 2. No está ya instalada
    // 3. No ha sido descartada en esta sesión
    // 4. Estamos en un dispositivo móvil
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setShowButton(isInstallable && !isInstalled && !dismissed && isMobile);

    console.log('📱 Estado PWA:', {
      isInstallable,
      isInstalled,
      isDismissed: dismissed,
      isMobile
    });
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      await installPWA();
      setIsDismissed(true);
      sessionStorage.setItem('installBannerDismissed', 'true');
      onInstall?.();
    } catch (error) {
      console.error('Error al instalar:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Usar sessionStorage en lugar de localStorage para que el descarte
    // solo dure durante la sesión actual
    sessionStorage.setItem('installBannerDismissed', 'true');
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden animate-fade-up">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 p-4">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm shadow-md"
        >
          ×
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-50 rounded-xl">
              <img src="/icon.svg" alt="MiCocina" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Instalar MiCocina</h3>
              <p className="text-sm text-gray-500">
                Accede más rápido y sin conexión
              </p>
            </div>
          </div>
          
          <button
            onClick={handleInstall}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 active:opacity-100 transition-opacity shadow-sm"
          >
            <Download size={18} />
            <span>Instalar</span>
          </button>
        </div>
      </div>
    </div>
  );
}