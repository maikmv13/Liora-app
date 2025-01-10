import React, { useState } from 'react';
import { Recipe, MealType } from '../types';
import { RecipeCard } from './RecipeCard';
import { Filter, ChefHat, Moon, Sun, Heart, Flame, Clock } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => void;
}

const categories = [
  { id: 'Todas', emoji: '🍽️', label: 'Todas' },
  { id: 'Aves', emoji: '🍗', label: 'Aves' },
  { id: 'Carnes', emoji: '🥩', label: 'Carnes' },
  { id: 'Ensaladas', emoji: '🥗', label: 'Ensaladas' },
  { id: 'Fast Food', emoji: '🍔', label: 'Fast Food' },
  { id: 'Legumbres', emoji: '🫘', label: 'Legumbres' },
  { id: 'Pastas y Arroces', emoji: '🍝', label: 'Pastas y Arroces' },
  { id: 'Pescados', emoji: '🐟', label: 'Pescados' },
  { id: 'Sopas y Cremas', emoji: '🥣', label: 'Sopas y Cremas' },
  { id: 'Vegetariano', emoji: '🥬', label: 'Vegetariano' }
];

const mealTypes = [
  { id: 'all', label: 'Todas', icon: ChefHat, description: 'Todas las recetas' },
  { id: 'comida', label: 'Comidas', icon: Sun, description: 'Platos principales' },
  { id: 'cena', label: 'Cenas', icon: Moon, description: 'Cenas ligeras' }
];

const sortOptions = [
  { id: 'popular', label: 'Más populares', icon: Heart },
  { id: 'calories', label: 'Menos calorías', icon: Flame },
  { id: 'time', label: 'Más rápidas', icon: Clock }
];

export function RecipeList({ recipes, onRecipeSelect, favorites, onToggleFavorite }: RecipeListProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState<'all' | MealType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | 'time' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
            {categories.find(cat => cat.id === selectedCategory)?.emoji || '🍽️'}
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Descubre Recetas</h2>
            <p className="text-sm md:text-base text-gray-600">
              {selectedMealType === 'all' 
                ? '✨ Explora nuestra colección de deliciosas recetas'
                : selectedMealType === 'comida'
                  ? '🌞 Las mejores recetas para tus comidas'
                  : '🌙 Cenas ligeras y deliciosas'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm"
          />
          <ChefHat size={20} className="absolute left-4 top-3.5 text-rose-400" />
        </div>

        {/* Filtros en scroll horizontal */}
        <div className="space-y-3">
          {/* Tipo de comida */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {mealTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedMealType(type.id as 'all' | MealType)}
                className={`flex-none flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedMealType === type.id
                    ? type.id === 'comida'
                      ? 'bg-amber-100 text-amber-700 shadow-inner'
                      : type.id === 'cena'
                        ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                        : 'bg-rose-100 text-rose-700 shadow-inner'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
                }`}
              >
                <type.icon size={18} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-rose-100 text-rose-700 shadow-inner'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
                }`}
              >
                <span>{category.emoji} {category.label}</span>
              </button>
            ))}
          </div>

          {/* Ordenar por */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as 'popular' | 'calories' | 'time')}
                className={`flex-none flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  sortBy === option.id
                    ? 'bg-orange-100 text-orange-700 shadow-inner'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
                }`}
              >
                <option.icon size={18} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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