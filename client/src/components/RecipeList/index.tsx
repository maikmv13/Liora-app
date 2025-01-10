import React, { useState } from 'react';
import { Recipe, MealType } from '../../types';
import { RecipeCard } from '../RecipeCard';
import { ChefHat, ChevronRight } from 'lucide-react';
import { RecipeFilters } from './RecipeFilters';
import { HealthyPlateGuide } from '../HealthyPlateGuide';

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
  const [showHealthyPlate, setShowHealthyPlate] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'Todas' || recipe.Categoria === selectedCategory;
    const matchesMealType = selectedMealType === 'all' || recipe.Tipo.toLowerCase() === selectedMealType;
    const matchesSearch = recipe.Plato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.Categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMealType && matchesSearch;
  }).map(recipe => ({
    ...recipe,
    isFavorite: favorites.includes(recipe.Plato)
  }));

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'calories') {
      return parseInt(a.Calorias) - parseInt(b.Calorias);
    }
    if (sortBy === 'time') {
      const getMinutes = (time: string) => parseInt(time) || 30;
      return getMinutes(a["Tiempo de preparación"]) - getMinutes(b["Tiempo de preparación"]);
    }
    return 0;
  });

  return (
    <div className="relative space-y-6">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl" role="img" aria-label="recipe emoji">
            {selectedCategory === 'Todas' ? '🍽️' : filteredRecipes[0]?.Categoria || '🍽️'}
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Descubre Recetas</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {selectedMealType === 'all' 
                ? '✨ Explora nuestra colección de deliciosas recetas'
                : selectedMealType === 'comida'
                  ? '🌞 Las mejores recetas para tus comidas'
                  : '🌙 Cenas ligeras y deliciosas'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHealthyPlate(!showHealthyPlate)}
          className="flex items-center space-x-2 px-4 py-2 mt-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-colors shadow-sm"
        >
          <span>Guía de alimentación saludable</span>
          <ChevronRight size={16} className={`transform transition-transform ${showHealthyPlate ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {showHealthyPlate && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 p-6">
          <HealthyPlateGuide />
        </div>
      )}

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

      {/* Lista de recetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedRecipes.map((recipe) => (
          <RecipeCard 
            key={recipe.Plato} 
            recipe={recipe}
            onClick={() => onRecipeSelect(recipe)}
            onToggleFavorite={() => onToggleFavorite(recipe)}
          />
        ))}
      </div>

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