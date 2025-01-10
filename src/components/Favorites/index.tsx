import React, { useState } from 'react';
import { Heart, Search, Filter, Plus, Star, Clock, ChevronDown, ChevronUp, Trash2, Edit2 } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from '../RecipeModal';
import { EditRecipeModal } from './EditRecipeModal';

interface FavoritesProps {
  favorites: FavoriteRecipe[];
  onRemoveFavorite: (recipe: FavoriteRecipe) => void;
  onUpdateFavorite: (recipe: FavoriteRecipe) => void;
}

type SortOption = 'recent' | 'name' | 'rating' | 'lastCooked';

export function Favorites({ favorites, onRemoveFavorite, onUpdateFavorite }: FavoritesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedRecipe, setSelectedRecipe] = useState<FavoriteRecipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<FavoriteRecipe | null>(null);

  const categories = ['Todas', ...new Set(favorites.map(recipe => recipe.Categoria))];

  const filteredRecipes = favorites.filter(recipe => {
    const matchesSearch = recipe.Plato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || recipe.Categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'name':
        return a.Plato.localeCompare(b.Plato);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'lastCooked':
        if (!a.lastCooked) return 1;
        if (!b.lastCooked) return -1;
        return new Date(b.lastCooked).getTime() - new Date(a.lastCooked).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recetas Favoritas</h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {favorites.length} recetas guardadas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <Filter size={20} />
            <span>Filtros</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            onClick={() => {}}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Nueva Receta</span>
          </button>
        </div>
      </div>

      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
          >
            <Clock size={14} />
            <span>Más recientes</span>
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              sortBy === 'rating'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
          >
            <Star size={14} />
            <span>Mejor valoradas</span>
          </button>
          <button
            onClick={() => setSortBy('lastCooked')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              sortBy === 'lastCooked'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
          >
            <Clock size={14} />
            <span>Última vez cocinada</span>
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-rose-500" />
          </div>
          <p className="text-gray-900 font-medium">No hay recetas favoritas</p>
          <p className="text-gray-500 text-sm mt-1">Guarda tus recetas favoritas para acceder rápidamente a ellas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.Plato}
              recipe={recipe}
              onSelect={() => setSelectedRecipe(recipe)}
              onEdit={() => setEditingRecipe(recipe)}
              onRemove={() => onRemoveFavorite(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}

      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSave={(updatedRecipe) => {
            onUpdateFavorite(updatedRecipe);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
}