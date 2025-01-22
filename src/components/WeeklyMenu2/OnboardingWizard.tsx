import React, { useState, useEffect } from 'react';
import { ChefHat, X, Check, Search, Heart, Clock, Users, Flame, Sparkles } from 'lucide-react';
import { MealType, Recipe } from '../../types';
import { mealTypes } from '../../types/categories';
import { supabase } from '../../lib/supabase';
import { useActiveProfile } from '../../hooks/useActiveProfile';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onGenerateMenu: () => void;
}

const TOTAL_REQUIRED = 8; // 2 recetas por cada tipo de comida

export function OnboardingWizard({ 
  isOpen, 
  onClose, 
  onComplete,
  onGenerateMenu 
}: OnboardingWizardProps) {
  const { id, isHousehold, profile } = useActiveProfile();
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

        // Get favorites - considerar household_id si es necesario
        const query = supabase
          .from('favorites')
          .select(`
            recipe_id,
            recipes!favorites_recipe_id_fkey (meal_type)
          `);

        // Ajustar la consulta según si es household o no
        if (isHousehold && profile?.household_id) {
          query.eq('household_id', profile.household_id);
        } else if (id) {
          query.eq('user_id', id);
        }

        const { data: favsData, error: favsError } = await query;

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
  }, [isOpen, currentMealType, id, isHousehold, profile?.household_id]);

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
          .eq(isHousehold ? 'household_id' : 'user_id', isHousehold ? profile?.household_id : id)
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
            household_id: isHousehold ? profile?.household_id : null,
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

  const handleComplete = () => {
    if (progress >= 100) {
      onComplete();
      onGenerateMenu();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-6">
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
                <h2 className="text-lg font-semibold text-gray-900">
                  ✨ Personaliza tu menú
                </h2>
                <p className="text-sm text-gray-600">
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
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {totalFavorites} de {TOTAL_REQUIRED} recetas seleccionadas
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Meal Type Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {mealTypes.map(({ id, label, emoji }) => {
              const count = favoriteStats[id as MealType] || 0;
              const isComplete = count >= 2;
              
              return (
                <button
                  key={id}
                  onClick={() => setCurrentMealType(id as MealType)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors
                    ${currentMealType === id
                      ? 'bg-rose-500 text-white'
                      : isComplete
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{emoji}</span>
                  <span className="font-medium">{label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${isComplete ? 'bg-emerald-500 text-white' : 'bg-white/20'}
                  `}>
                    {count}/2
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Cargando recetas...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <ChefHat size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No hay recetas disponibles</p>
              </div>
            ) : (
              recipes
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
                    <div className="relative aspect-video bg-gray-100">
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
                      <h3 className="font-medium text-gray-900 mb-2">
                        {recipe.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
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
                ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleComplete}
            disabled={progress < 100}
            className={`
              w-full py-3 rounded-xl font-medium transition-all duration-200
              ${progress >= 100
                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {progress >= 100 ? '✨ Generar Menú' : '🔒 Selecciona más recetas'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;