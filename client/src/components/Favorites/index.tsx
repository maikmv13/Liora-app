import React, { useState } from 'react';
import { Heart, Plus, ChevronDown } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from '../RecipeCard';
import { RecipeModal } from '../RecipeModal';
import { EditRecipeModal } from './EditRecipeModal';
import { RecipeFilters } from '../RecipeList/RecipeFilters';
import { NewRecipeModal } from './NewRecipeModal';

interface FavoritesProps {
  favorites: FavoriteRecipe[];
  onRemoveFavorite: (recipe: FavoriteRecipe) => void;
  onUpdateFavorite: (recipe: FavoriteRecipe) => void;
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
    const matchesCategory = selectedCategory === 'Todas' || recipe.Categoria === selectedCategory;
    const matchesMealType = selectedMealType === 'all' || recipe.Tipo.toLowerCase() === selectedMealType;
    const matchesSearch = recipe.Plato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.Categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMealType && matchesSearch;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'calories') {
      return parseInt(a.Calorias) - parseInt(b.Calorias);
    }
    if (sortBy === 'time') {
      const getMinutes = (time: string) => parseInt(time) || 30;
      return getMinutes(a["Tiempo de preparación"]) - getMinutes(b["Tiempo de preparación"]);
    }
    if (sortBy === 'popular') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
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
        onMealTypeChange={setSelectedMealType}
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
              key={recipe.Plato}
              recipe={{
                id: recipe.Plato,
                name: recipe.Plato,
                side_dish: recipe.Acompañamiento || null,
                meal_type: recipe.Tipo as "comida" | "cena" | "desayuno" | "snack",
                category: recipe.Categoria as "Carnes" | "Pescados" | "Vegetariano" | "Pasta" | "Sopas" | "Ensaladas",
                servings: recipe.Comensales,
                calories: parseInt(recipe.Calorias).toString(),
                prep_time: recipe["Tiempo de preparación"],
                energy_kj: recipe["Valor energético (kJ)"],
                fats: recipe.Grasas,
                saturated_fats: recipe.Saturadas,
                carbohydrates: recipe.Carbohidratos,
                sugars: recipe.Azúcares,
                fiber: recipe.Fibra,
                proteins: recipe.Proteínas,
                sodium: recipe.Sodio,
                instructions: recipe.Instrucciones,
                url: recipe.Url,
                pdf_url: recipe.PDF_Url,
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                isFavorite: true
              }}
              onClick={() => setSelectedRecipe(recipe)}
              onToggleFavorite={() => onRemoveFavorite(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={() => {}}
          isFavorite={true}
          onToggleFavorite={() => {
            onRemoveFavorite(selectedRecipe);
            setSelectedRecipe(null);
          }}
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
              addedAt: new Date().toISOString(),
              rating: 0
            });
            setShowNewRecipeModal(false);
          }}
        />
      )}
    </div>
  );
}