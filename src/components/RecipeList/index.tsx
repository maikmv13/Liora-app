import React, { useState } from 'react';
import { Recipe, MealType } from '../../types';
import { RecipeCard } from './RecipeCard';
import { ChefHat, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { RecipeFilters } from './RecipeFilters';
import { useNavigate } from 'react-router-dom';
import { LoadingFallback } from '../LoadingFallback';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: { recipe_id: string }[];
  onToggleFavorite: (recipe: Recipe) => void;
  loading?: boolean;
}

export function RecipeList({ 
  recipes, 
  onRecipeSelect, 
  favorites, 
  onToggleFavorite,
  loading 
}: RecipeListProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState<'all' | MealType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | 'time' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (loading) {
    return <LoadingFallback />;
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;
    const matchesMealType = selectedMealType === 'all' || recipe.meal_type === selectedMealType;
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMealType && matchesSearch;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'calories') {
      const caloriesA = a.calories ? parseInt(a.calories) : 0;
      const caloriesB = b.calories ? parseInt(b.calories) : 0;
      return caloriesA - caloriesB;
    }
    if (sortBy === 'time') {
      const getMinutes = (time: string | null) => time ? parseInt(time) : 0;
      return getMinutes(a.prep_time) - getMinutes(b.prep_time);
    }
    return 0;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Favorites Banner - Optimized for mobile */}
      <button
        onClick={() => navigate('/favoritos')}
        className="relative w-full overflow-hidden group rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center justify-between p-3 md:p-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-white/20 p-2 md:p-3 rounded-xl backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
              <Heart size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-white text-base md:text-xl font-bold flex items-center space-x-2">
                <span>Tus Recetas Favoritas</span>
                <Sparkles size={16} className="text-amber-300 animate-pulse md:w-5 md:h-5" />
              </h3>
              <p className="text-white/90 text-xs md:text-base mt-0.5">
                👩‍🍳 {favorites.length} favoritas de {recipes.length} recetas
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/20 transition-colors">
            <span className="text-white font-medium text-sm md:text-base hidden md:block">Ver Favoritos</span>
            <ArrowRight size={18} className="text-white transform group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
          </div>
        </div>
      </button>

      {/* Filters */}
      <RecipeFilters
        selectedCategory={selectedCategory}
        selectedMealType={selectedMealType}
        sortBy={sortBy}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onMealTypeChange={setSelectedMealType}
        onSortChange={setSortBy}
        onSearchChange={setSearchTerm}
      />

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedRecipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id}
            recipe={recipe}
            favorites={favorites.map(f => f.recipe_id)}
            onClick={() => onRecipeSelect(recipe)}
            onToggleFavorite={() => onToggleFavorite(recipe)}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedRecipes.length === 0 && (
        <div className="text-center py-8 md:py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
          <div className="bg-rose-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <ChefHat size={24} className="text-rose-500 md:w-8 md:h-8" />
          </div>
          <p className="text-gray-900 font-medium">No se encontraron recetas 😔</p>
          <p className="text-sm md:text-base text-gray-500 mt-1">Prueba con otros filtros ✨</p>
        </div>
      )}
    </div>
  );
}