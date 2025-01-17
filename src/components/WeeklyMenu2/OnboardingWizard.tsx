import React, { useState, useEffect } from 'react';
import { ChefHat, X, Check, Search, Heart, Clock, Users, Flame } from 'lucide-react';
import { MealType, Recipe } from '../../types';
import { mealTypes, mealTypeCategories } from '../../types/categories';
import { supabase } from '../../lib/supabase';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onGenerateMenu: () => void;
}

const TOTAL_REQUIRED = 8; // 2 recipes per meal type

export function OnboardingWizard({ 
  isOpen, 
  onClose, 
  onComplete,
  onGenerateMenu 
}: OnboardingWizardProps) {
  const [currentMealType, setCurrentMealType] = useState<MealType>('desayuno');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteStats, setFavoriteStats] = useState<Record<MealType, number>>({
    desayuno: 0,
    comida: 0,
    snack: 0,
    cena: 0
  });
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [progress, setProgress] = useState(0);

  // Load recipes and favorites
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get recipes for current meal type
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients (
              id,
              quantity,
              unit,
              ingredient_id,
              ingredients (
                id,
                name,
                category
              )
            )
          `)
          .eq('meal_type', currentMealType)
          .in('category', mealTypeCategories[currentMealType]);

        if (recipesError) throw recipesError;

        // Get favorites
        const { data: favsData, error: favsError } = await supabase
          .from('favorites')
          .select('recipe_id, recipes!favorites_recipe_id_fkey (meal_type)')
          .eq('user_id', user.id);

        if (favsError) throw favsError;

        // Update state
        setRecipes(recipesData || []);
        setFavorites(favsData?.map(f => f.recipe_id) || []);

        // Calculate stats
        const stats = favsData?.reduce((acc, fav) => {
          const mealType = fav.recipes?.meal_type as MealType;
          if (mealType) {
            acc[mealType] = (acc[mealType] || 0) + 1;
          }
          return acc;
        }, {} as Record<MealType, number>);

        setFavoriteStats(prev => ({
          ...prev,
          ...stats
        }));

      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, currentMealType]);

  // Update progress
  useEffect(() => {
    const total = Object.values(favoriteStats).reduce((sum, count) => sum + count, 0);
    setTotalFavorites(total);
    setProgress((total / TOTAL_REQUIRED) * 100);
  }, [favoriteStats]);

  const handleToggleFavorite = async (recipe: Recipe) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isFavorite = favorites.includes(recipe.id);

      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id);

        setFavorites(prev => prev.filter(id => id !== recipe.id));
        setFavoriteStats(prev => ({
          ...prev,
          [recipe.meal_type]: Math.max(0, (prev[recipe.meal_type] || 0) - 1)
        }));
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipe.id,
            created_at: new Date().toISOString()
          });

        setFavorites(prev => [...prev, recipe.id]);
        setFavoriteStats(prev => ({
          ...prev,
          [recipe.meal_type]: (prev[recipe.meal_type] || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getMealTypeColor = (type: MealType) => {
    switch (type) {
      case 'desayuno':
        return 'bg-amber-50 text-amber-600';
      case 'comida':
        return 'bg-orange-50 text-orange-600';
      case 'snack':
        return 'bg-emerald-50 text-emerald-600';
      case 'cena':
        return 'bg-indigo-50 text-indigo-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const isMealTypeComplete = (type: MealType) => {
    const required = mealTypes.find(mt => mt.id === type)?.requiredRecipes || 2;
    return favoriteStats[type] >= required;
  };

  const handleComplete = () => {
    if (progress >= 100) {
      onComplete();
      onGenerateMenu();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-rose-50 p-3 rounded-xl">
                <ChefHat size={24} className="text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Personaliza tu menú</h2>
                <p className="text-sm md:text-base text-gray-600">
                  Selecciona tus recetas favoritas para generar menús personalizados
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs md:text-sm">
                <span className="text-gray-600">
                  {totalFavorites} de {TOTAL_REQUIRED} recetas favoritas
                </span>
                <span className="text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Meal type indicators - Scrollable on mobile */}
          <div className="flex overflow-x-auto gap-2 mt-4 pb-2 md:pb-0 md:gap-4 scrollbar-hide">
            {mealTypes.map(({ id, label, emoji, requiredRecipes }) => {
              const isComplete = isMealTypeComplete(id as MealType);
              return (
                <button 
                  key={id}
                  onClick={() => setCurrentMealType(id as MealType)}
                  className={`flex-none flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                    id === currentMealType
                      ? getMealTypeColor(id as MealType)
                      : isComplete
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {isComplete ? (
                    <Check size={20} className="text-emerald-500" />
                  ) : (
                    <span>{emoji}</span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                    <span className="text-xs">
                      {favoriteStats[id as MealType] || 0}/{requiredRecipes}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No hay recetas disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes
                .filter(recipe => 
                  recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(recipe => (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Recipe Image */}
                    <div className="relative aspect-[16/9] bg-gray-100">
                      {recipe.image_url ? (
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Recipe Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {recipe.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                          {recipe.category}
                        </span>
                        {recipe.calories && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-600">
                            <Flame size={12} />
                            <span>{recipe.calories}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            <span>{recipe.servings}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{recipe.prep_time || "30 min"}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleFavorite(recipe)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.includes(recipe.id)
                              ? 'bg-rose-50 text-rose-500'
                              : 'hover:bg-rose-50 text-gray-400 hover:text-rose-500'
                          }`}
                        >
                          <Heart 
                            size={20} 
                            className={favorites.includes(recipe.id) ? 'fill-current' : ''} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleComplete}
              disabled={progress < 100}
              className={`
                px-4 py-2 rounded-xl font-medium transition-colors
                ${progress >= 100
                  ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white hover:from-orange-500 hover:via-pink-600 hover:to-rose-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {progress >= 100 ? 'Generar Menú' : 'Selecciona más recetas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}