import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Interfaz para el objeto navigator en iOS
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si la app ya está instalada
    const checkInstallState = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as NavigatorStandalone).standalone ||
                          document.referrer.includes('android-app://');

      // Verificar también el localStorage
      const wasInstalled = localStorage.getItem('pwaInstalled') === 'true';
      
      setIsInstalled(isStandalone || wasInstalled);
    };

    checkInstallState();

    // Manejar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      console.log('🚀 PWA instalable detectada');
      
      // Solo guardar el prompt si la app no está instalada
      if (!isInstalled) {
        setDeferredPrompt(e);
        setIsInstallable(true);
      }
    };

    // Manejar el evento appinstalled
    const handleAppInstalled = () => {
      console.log('✅ PWA instalada correctamente');
      localStorage.setItem('pwaInstalled', 'true');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Escuchar cambios en el modo de visualización
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        localStorage.setItem('pwaInstalled', 'true');
        setIsInstalled(true);
      }
    };

    // Registrar los event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [isInstalled]);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('❌ No se puede instalar la PWA (no hay prompt)');
      return;
    }

    try {
      console.log('📱 Mostrando prompt de instalación');
      await deferredPrompt.prompt();
      
      const choiceResult = await deferredPrompt.userChoice;
      console.log('✅ Resultado de instalación:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('pwaInstalled', 'true');
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('❌ Error al instalar la PWA:', error);
    }
  };

  return {
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    installPWA
  };
}