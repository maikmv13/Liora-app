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
      // Prevenir comportamiento por defecto
      e.preventDefault();
      console.log('🚀 PWA instalable detectada'); // Debug log
      
      // Guardar el evento
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Debug: verificar si el evento está registrado
    console.log('🎯 Listener de PWA registrado');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('❌ No se puede instalar la PWA (no hay prompt)');
      return;
    }

    try {
      console.log('📱 Intentando mostrar el prompt de instalación');
      await deferredPrompt.prompt();
      
      const choiceResult = await deferredPrompt.userChoice;
      console.log('✅ Resultado de instalación:', choiceResult.outcome);
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('❌ Error al instalar la PWA:', error);
    }
  };

  return {
    isInstallable,
    installPWA
  };
}