import React, { useState } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => void;
}

const categories = [
  'Todas',
  'Carnes',
  'Pescados',
  'Vegetariano',
  'Pasta',
  'Arroces',
  'Sopas',
  'Ensaladas'
];

export function RecipeList({ recipes, onRecipeSelect, favorites, onToggleFavorite }: RecipeListProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showSidebar, setShowSidebar] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | null>(null);

  const filteredRecipes = recipes.filter(recipe => 
    selectedCategory === 'Todas' || recipe.Categoria === selectedCategory
  ).map(recipe => ({
    ...recipe,
    isFavorite: favorites.includes(recipe.Plato)
  }));

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'calories') {
      return parseInt(a.Calorias) - parseInt(b.Calorias);
    }
    return 0;
  });

  return (
    <div className="relative">
      <button 
        onClick={() => setShowSidebar(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
      >
        <Filter size={20} className="group-hover:rotate-180 transition-transform duration-300" />
        <span className="font-medium">Filtros</span>
      </button>

      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Descubre Recetas</h2>
            <p className="text-gray-600 mt-1">
              {selectedCategory === 'Todas' 
                ? 'Explora nuestra colección de deliciosas recetas'
                : `Mostrando recetas de ${selectedCategory.toLowerCase()}`
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.Plato} 
              recipe={recipe}
              onClick={() => onRecipeSelect(recipe)}
              onToggleFavorite={() => onToggleFavorite(recipe)}
            />
          ))}
        </div>
      </div>

      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowSidebar(false)}
      >
        <div 
          className={`absolute inset-y-0 right-0 w-80 bg-white/90 backdrop-blur-md shadow-xl p-6 transform transition-transform duration-300 ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
            <button 
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Ordenar por</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSortBy('popular');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    sortBy === 'popular'
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Más populares
                </button>
                <button
                  onClick={() => {
                    setSortBy('calories');
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    sortBy === 'calories'
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Calorías
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}