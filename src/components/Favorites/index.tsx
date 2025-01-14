import React, { useState } from 'react';
import { Heart, Plus, ChevronDown, ChefHat } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from '../RecipeList/RecipeCard';
import { RecipeModal } from '../RecipeList/RecipeModal';
import { EditRecipeModal } from './EditRecipeModal';
import { RecipeFilters } from '../RecipeList/RecipeFilters';
import { NewRecipeModal } from './NewRecipeModal';
import { mapRecipeToCardProps } from '../RecipeList/RecipeCard';

interface FavoritesProps {
  favorites: FavoriteRecipe[];
  onRemoveFavorite: (recipe: Recipe) => Promise<void>;
  onUpdateFavorite: (recipe: FavoriteRecipe) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

export function Favorites({ favorites, onRemoveFavorite, onUpdateFavorite }: FavoritesProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState<'all' | 'comida' | 'cena'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'calories' | 'time' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRecipeModal, setShowNewRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<FavoriteRecipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<FavoriteRecipe | null>(null);

  const filteredRecipes = favorites.filter(recipe => {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Heart size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recetas Favoritas</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              ❤️ {favorites.length} recetas guardadas
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNewRecipeModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-rose-600 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Nueva Receta</span>
          </button>
        </div>
      </div>

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
              key={recipe.id}
              recipe={{
                ...recipe,
                isFavorite: true,
                updated_at: new Date().toISOString(),
                created_at: recipe.created_at || new Date().toISOString()
              }}
              onClick={() => setSelectedRecipe(recipe)}
              onToggleFavorite={() => onRemoveFavorite(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={mapRecipeToCardProps(selectedRecipe)}
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

      {showNewRecipeModal && (
        <NewRecipeModal
          onClose={() => setShowNewRecipeModal(false)}
          onSave={(newRecipe) => {
            onUpdateFavorite({
              ...newRecipe,
              created_at: new Date().toISOString(),
              rating: 0,
              last_cooked: null,
              notes: '',
              tags: []
            });
            setShowNewRecipeModal(false);
          }}
        />
      )}
    </div>
  );
}