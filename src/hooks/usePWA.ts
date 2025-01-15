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
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Escuchar el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Comprobar si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA instalada con éxito');
    });

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