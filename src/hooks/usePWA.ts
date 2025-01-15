import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('PWA es instalable');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    console.log('Listener de PWA registrado');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('No se puede instalar la PWA');
      return;
    }

    try {
      // Mostrar el prompt de instalación
      await deferredPrompt.prompt();
      // Esperar la respuesta del usuario
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
      
      // Limpiar el prompt guardado
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error al instalar la PWA:', error);
    }
  };

  return {
    isInstallable,
    installPWA
  };
}