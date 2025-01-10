import React, { useState } from 'react';
import { Recipe, MealType, meal_category } from '../../types';
import { RecipeCard } from '../RecipeCard';
import { ChefHat } from 'lucide-react';
import { RecipeFilters } from './RecipeFilters';

const categories: Array<{id: meal_category, emoji: string, label: string}> = [
  { id: 'Carnes', emoji: '🥩', label: 'Carnes' },
  { id: 'Pescados', emoji: '🐟', label: 'Pescados' },
  { id: 'Vegetariano', emoji: '🥬', label: 'Vegetariano' },
  { id: 'Pasta', emoji: '🍝', label: 'Pasta' },
  { id: 'Sopas', emoji: '🥣', label: 'Sopas' },
  { id: 'Ensaladas', emoji: '🥗', label: 'Ensaladas' }
];

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

  const getDescriptionText = (mealType: 'all' | MealType) => {
    if (mealType === 'all') return '✨ Explora nuestra colección de deliciosas recetas';
    if (mealType === 'comida') return '🌞 Las mejores recetas para tus comidas';
    return '🌙 Cenas ligeras y deliciosas';
  };

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
          <div className="text-4xl" aria-hidden="true">
            {categories.find(cat => cat.id === selectedCategory)?.emoji || '🍽️'}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Descubre Recetas</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {getDescriptionText(selectedMealType)}
            </p>
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
      </div>

      {/* Lista de recetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              isFavorite: recipe.isFavorite
            }}
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