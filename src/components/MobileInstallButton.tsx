import React from 'react';
import { Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function MobileInstallButton() {
  const { isInstallable, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = React.useState(false);

  React.useEffect(() => {
    console.log('🔍 MobileInstallButton montado');
    console.log('📱 isInstallable:', isInstallable);
    
    const dismissed = localStorage.getItem('installBannerDismissed');
    console.log('🚫 Banner dismissed:', dismissed);
    
    if (dismissed) setIsDismissed(true);
  }, [isInstallable]);

  if (!isInstallable || isDismissed) return null;

  const handleInstall = async () => {
    try {
      await installPWA();
      setIsDismissed(true);
      localStorage.setItem('installBannerDismissed', 'true');
    } catch (error) {
      console.error('Error al instalar:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden">
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-4 animate-fade-up">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm"
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
              <p className="text-sm text-gray-500">Accede más rápido</p>
            </div>
          </div>
          
          <button
            onClick={handleInstall}
            className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-rose-600 active:bg-rose-700 transition-colors"
          >
            <Download size={18} />
            <span>Instalar</span>
          </button>
        </div>
      </div>
    </div>
  );
} 