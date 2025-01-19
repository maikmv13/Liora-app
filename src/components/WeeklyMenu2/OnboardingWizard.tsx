import React, { useState, useEffect } from 'react';
import { ChefHat, X, Check, Search, Heart, Clock, Users, Flame, Sparkles } from 'lucide-react';
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

        // Get all recipes
        const { data: allRecipes, error: recipesError } = await supabase
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
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;

        // Get favorites
        const { data: favsData, error: favsError } = await supabase
          .from('favorites')
          .select('recipe_id, recipes!favorites_recipe_id_fkey (meal_type)')
          .eq('user_id', user.id);

        if (favsError) throw favsError;

        // Filter recipes by current meal type
        setRecipes(allRecipes.filter(r => r.meal_type === currentMealType));
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

  // Añadir efecto para cambiar automáticamente de meal type
  useEffect(() => {
    const currentCount = favoriteStats[currentMealType] || 0;
    if (currentCount >= 2) {
      const mealTypes = ['desayuno', 'comida', 'snack', 'cena'] as MealType[];
      const currentIndex = mealTypes.indexOf(currentMealType);
      const nextIndex = (currentIndex + 1) % mealTypes.length;
      
      // Solo cambiar si el siguiente tipo no está completo
      if (favoriteStats[mealTypes[nextIndex]] < 2) {
        setCurrentMealType(mealTypes[nextIndex]);
      }
    }
  }, [favoriteStats, currentMealType]);

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

  const handleRandomSelection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener todas las recetas
      const { data: allRecipes } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!allRecipes) return;

      // Agrupar por tipo de comida
      const recipesByType = allRecipes.reduce((acc, recipe) => {
        if (!acc[recipe.meal_type]) {
          acc[recipe.meal_type] = [];
        }
        acc[recipe.meal_type].push(recipe);
        return acc;
      }, {} as Record<MealType, Recipe[]>);

      // Seleccionar 2 recetas aleatorias de cada tipo
      for (const mealType of Object.keys(recipesByType)) {
        const recipes = recipesByType[mealType as MealType];
        const selected = recipes
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);

        // Añadir a favoritos
        for (const recipe of selected) {
          if (!favorites.includes(recipe.id)) {
            await handleToggleFavorite(recipe);
          }
        }
      }
    } catch (error) {
      console.error('Error en selección aleatoria:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-2xl">
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header mejorado */}
                <div className="flex-shrink-0 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="bg-rose-100 p-2 rounded-lg">
                          <ChefHat size={20} className="text-rose-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1">
                          <Sparkles size={8} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="font-medium text-gray-900">✨ Personaliza tu menú</h2>
                        <p className="text-sm text-gray-500">
                          Selecciona al menos 2 recetas de cada tipo
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="px-4 pb-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>🎯 {totalFavorites} de {TOTAL_REQUIRED} recetas seleccionadas</span>
                    </div>
                  </div>

                  {/* Meal Type Selector mejorado */}
                  <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {[
                      { id: 'desayuno', label: 'Desayuno', emoji: '🍳', icon: '☀️' },
                      { id: 'comida', label: 'Comida', emoji: '🍽️', icon: '🌞' },
                      { id: 'snack', label: 'Snack', emoji: '🥨', icon: '🎯' },
                      { id: 'cena', label: 'Cena', emoji: '🌙', icon: '🌛' }
                    ].map(({ id, label, emoji, icon }) => {
                      const isActive = currentMealType === id;
                      const count = favoriteStats[id as MealType] || 0;
                      const isComplete = count >= 2;
                      
                      return (
                        <button
                          key={id}
                          onClick={() => setCurrentMealType(id as MealType)}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap
                            transition-all duration-200 hover:scale-105
                            ${isActive 
                              ? 'bg-rose-500 text-white shadow-md scale-105' 
                              : isComplete
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }
                          `}
                        >
                          <span className="text-base">{emoji}</span>
                          <span className="font-medium">{label}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            count >= 2 ? 'bg-emerald-500 text-white' : 'bg-white/20'
                          }`}>
                            {icon} {count}/2
                          </span>
                        </button>
                      );
                    })}
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

                {/* Footer modificado */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleRandomSelection}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                    >
                      <span>🎲</span>
                      <span>Selección Aleatoria</span>
                      <span>✨</span>
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={progress < 100}
                      className={`
                        px-6 py-2 rounded-lg font-medium transition-all duration-200
                        ${progress >= 100
                          ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {progress >= 100 ? '✨ Generar Menú' : '🔒 Selecciona más recetas'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}