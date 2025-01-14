import React, { useState } from 'react';
import { Recipe, MealType } from '../../types';
import { RecipeCard, mapRecipeToCardProps } from './RecipeCard';
import { ChefHat } from 'lucide-react';
import { RecipeFilters } from './RecipeFilters';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onRecipeSelect, favorites, onToggleFavorite }: RecipeListProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState<'all' | MealType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | 'time' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <ChefHat size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Descubre nuevas recetas!!</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              👩‍🍳 {recipes.length} recetas disponibles
            </p>
          </div>
        </div>
      </div>

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
        {sortedRecipes.map((recipe) => {
          const cardProps = {
            ...mapRecipeToCardProps(recipe),
            isFavorite: favorites.includes(recipe.name)
          };
          
          return (
            <RecipeCard 
              key={recipe.name}
              recipe={cardProps}
              onClick={() => onRecipeSelect(recipe)}
              onToggleFavorite={() => onToggleFavorite(recipe)}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {sortedRecipes.length === 0 && (
        <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={32} className="text-rose-500" />
          </div>
          <p className="text-gray-900 font-medium">No se encontraron recetas 😔</p>
          <p className="text-gray-500 text-sm mt-1">Prueba con otros filtros ✨</p>
        </div>
      )}
    </div>
  );
}