import { registerSW } from 'virtual:pwa-register'

export const registerPWA = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
        updateSW()
      }
    },
    onOfflineReady() {
      console.log('La aplicación está lista para uso offline')
    },
  })
} 