import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFavorites } from './useFavorites';
import { Notifications } from '../components/Notifications/FavoriteMessages';
import { Recipe } from '../types';

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
      Notifications.custom({
        title: "¡Necesitas más favoritos!",
        message: `Te faltan ${totalRequired - totalFavorites} recetas`,
        icon: "welcome"
      });
    }
  }, [location.pathname, favorites, loading]);

  return null;
} 