import React, { useState, useEffect } from 'react';
import { Heart, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from '../RecipeList/RecipeCard';
import { RecipeFilters } from '../RecipeList/RecipeFilters';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { MemberFavoritesList } from './MemberFavoritesList';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoritesProps {
  favorites: FavoriteRecipe[];
  loading?: boolean;
  error?: Error | null;
  onRemoveFavorite: (recipe: FavoriteRecipe) => Promise<void>;
  onUpdateFavorite: (recipe: FavoriteRecipe) => Promise<void>;
}

export function Favorites({ 
  favorites: propFavorites,
  loading: propLoading,
  error: propError,
  onRemoveFavorite,
  onUpdateFavorite
}: FavoritesProps) {
  const { isHousehold } = useActiveProfile();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState<'all' | 'comida' | 'cena'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | 'time' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'personal' | 'household' | 'members'>('personal');

  // Usar el hook useFavorites para cada vista
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
      favorites: propFavorites,
      householdFavorites,
      loading: propLoading,
      error: propError,
      isHousehold,
      viewMode
    });
  }, [propFavorites, householdFavorites, propLoading, propError, isHousehold, viewMode]);

  // Manejar la eliminación según el modo de vista
  const handleRemoveFavorite = async (recipe: FavoriteRecipe) => {
    try {
      if (viewMode === 'personal') {
        await removePersonalFavorite(recipe);
      } else {
        await removeHouseholdFavorite(recipe);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (personalLoading || householdLoading) {
    return <div className="text-center py-12">Cargando favoritos...</div>;
  }

  if (personalError || householdError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar los favoritos</p>
      </div>
    );
  }

  const renderFavorites = () => {
    // Si estamos en la vista de miembros, renderizar MemberFavoritesList
    if (viewMode === 'members') {
      return (
        <MemberFavoritesList
          favorites={householdFavorites}
          onUpdateFavorite={handleRemoveFavorite}
        />
      );
    }

    // Para las otras vistas (personal y household)
    let recipesToRender = viewMode === 'personal' ? personalFavorites : householdFavorites;

    // Filtrar las recetas que han sido eliminadas
    recipesToRender = recipesToRender.filter(recipe => recipe.favorite_id);

    if (!recipesToRender?.length) {
      return (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-rose-500" />
          </div>
          <p className="text-gray-900 font-medium">
            {viewMode === 'household' 
              ? 'No hay recetas favoritas en el household'
              : 'No hay recetas favoritas personales'
            }
          </p>
        </div>
      );
    }

    const filteredRecipes = recipesToRender.filter(recipe => {
      const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;
      const matchesMealType = selectedMealType === 'all' || recipe.meal_type.toLowerCase() === selectedMealType;
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesMealType && matchesSearch;
    });

    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      if (sortBy === 'calories') {
        return parseInt(a.calories || '0') - parseInt(b.calories || '0');
      }
      if (sortBy === 'time') {
        const getMinutes = (time: string) => parseInt(time) || 30;
        return getMinutes(a.prep_time || '') - getMinutes(b.prep_time || '');
      }
      if (sortBy === 'popular') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecipes.map(recipe => (
          <RecipeCard
            key={`${recipe.id}-${recipe.favorite_id}`}
            recipe={recipe}
            favorites={recipesToRender.map(f => f.favorite_id)}
            onToggleFavorite={() => handleRemoveFavorite(recipe)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Heart size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {viewMode === 'household' 
                ? 'Favoritos del Hogar'
                : '¡Mis recetas guardadas!'
              }
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              ❤️ {propFavorites.length} recetas favoritas
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
              <span className="font-medium">Personal</span>
            </motion.button>

            {/* Vista Hogar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode('household')}
              className={`
                flex-1 sm:flex-none flex items-center justify-center space-x-2 
                px-4 py-2.5 rounded-xl transition-all duration-200
                ${viewMode === 'household' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-emerald-50 border border-emerald-100'
                }
              `}
            >
              <Users size={18} />
              <span className="font-medium">Familiar</span>
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
              <span className="font-medium">Por Miembro</span>
            </motion.button>
          </div>
        )}
      </div>

      {viewMode !== 'members' && (
        <RecipeFilters
          selectedCategory={selectedCategory}
          selectedMealType={selectedMealType}
          sortBy={sortBy}
          searchTerm={searchTerm}
          onCategoryChange={setSelectedCategory}
          onMealTypeChange={(mealType) => setSelectedMealType(mealType as 'comida' | 'cena' | 'all')}
          onSortChange={setSortBy}
          onSearchChange={setSearchTerm}
        />
      )}

      {renderFavorites()}
    </div>
  );
}

export default Favorites;