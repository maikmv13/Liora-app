import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFavorites } from './useFavorites';
import { FavoriteRecipe } from '../types';

// Mensaje simple a la consola en lugar de notificación
const showConsoleMessage = (title: string, message: string) => {
  console.info(`${title}: ${message}`);
};

const REQUIRED_PER_TYPE = 2;

export function useRequiredFavorites() {
  const location = useLocation();
  const { favorites, loading } = useFavorites();

  useEffect(() => {
    if (location.pathname === '/liora' || location.pathname === '/menu') return;
    if (loading) return;

    const totalRequired = REQUIRED_PER_TYPE * 4; // 2 recetas * 4 tipos
    const totalFavorites = favorites.length;

    if (totalFavorites < totalRequired) {
      // Reemplazamos la notificación con un mensaje a la consola
      // TODO: Implementar un sistema de notificaciones adecuado
      showConsoleMessage(
        "¡Necesitas más favoritos!",
        `Te faltan ${totalRequired - totalFavorites} recetas`
      );
    }
  }, [location.pathname, favorites, loading]);

  return null;
} 