import React from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { Favorites } from './index';

export function FavoritesList() {
  const { 
    favorites, 
    householdFavorites, 
    householdMembersFavorites,
    loading,
    error,
    addFavorite,
    removeFavorite
  } = useFavorites();

  // Añadir log al inicio del componente
  console.log('FavoritesList Component Data:', {
    favorites,
    householdFavorites,
    householdMembersFavorites,
    loading,
    error
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar los favoritos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Favorites
        favorites={favorites}
        householdFavorites={householdFavorites}
        householdMembersFavorites={householdMembersFavorites}
        loading={loading}
        error={error}
        onRemoveFavorite={removeFavorite}
        onUpdateFavorite={addFavorite}
      />
    </div>
  );
}

export default FavoritesList;
