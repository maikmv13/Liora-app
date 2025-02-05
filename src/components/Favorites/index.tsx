import React, { useState, useEffect } from 'react';
import { Heart, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { FavoriteRecipe } from '../../types';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { MemberFavoritesList } from './MemberFavoritesList';
import { useFavorites } from '../../hooks/useFavorites';
import { RecipeGrid } from './RecipeGrid';
import { LoadingFallback } from '../LoadingFallback';

interface FavoritesProps {
  favorites: FavoriteRecipe[];
  loading?: boolean;
  error?: Error | null;
  onRemoveFavorite: (recipe: FavoriteRecipe) => Promise<void>;
  onUpdateFavorite: (recipe: FavoriteRecipe) => Promise<void>;
}

export function Favorites() {
  const { id: userId, profile } = useActiveProfile();
  const isHousehold = Boolean(profile?.linked_household_id);
  const [viewMode, setViewMode] = useState<'personal' | 'members'>('personal');

  const {
    favorites: personalFavorites,
    loading: personalLoading,
    error: personalError,
    removeFavorite: removePersonalFavorite
  } = useFavorites(false);

  const {
    favorites: householdFavorites,
    loading: householdLoading,
    error: householdError,
    removeFavorite: removeHouseholdFavorite
  } = useFavorites(true);

  useEffect(() => {
    console.log('Favorites props updated:', {
      favorites: personalFavorites,
      householdFavorites,
      loading: personalLoading,
      error: personalError,
      isHousehold,
      viewMode
    });
  }, [personalFavorites, householdFavorites, personalLoading, personalError, isHousehold, viewMode]);

  if (personalLoading || householdLoading) {
    return <LoadingFallback />;
  }

  if (personalError || householdError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar los favoritos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Heart size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {viewMode === 'members' ? 'Favoritos por Miembro' : '¡Mis recetas guardadas!'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              ❤️ {personalFavorites.length} recetas favoritas
            </p>
          </div>
        </div>

        {isHousehold && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Vista Personal */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode('personal')}
              className={`
                flex-1 sm:flex-none flex items-center justify-center space-x-2 
                px-4 py-2.5 rounded-xl transition-all duration-200
                ${viewMode === 'personal' 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-rose-50 border border-rose-100'
                }
              `}
            >
              <User size={18} />
              <span className="font-medium">Mías</span>
            </motion.button>

            {/* Vista por Miembros */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode('members')}
              className={`
                flex-1 sm:flex-none flex items-center justify-center space-x-2 
                px-4 py-2.5 rounded-xl transition-all duration-200
                ${viewMode === 'members' 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-violet-50 border border-violet-100'
                }
              `}
            >
              <Users size={18} />
              <span className="font-medium">Miembros</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Contenido según el modo */}
      {viewMode === 'members' ? (
        <MemberFavoritesList 
          favorites={householdFavorites}
          onUpdateFavorite={removeHouseholdFavorite}
        />
      ) : (
        <RecipeGrid 
          recipes={personalFavorites}
          onRemoveFavorite={removePersonalFavorite}
        />
      )}
    </div>
  );
}

export default Favorites;