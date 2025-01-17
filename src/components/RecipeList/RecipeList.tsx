import React from 'react';
import { Recipe } from '../../types';
import { parsePreparationTime } from '../../utils/timeUtils';
import { RecipeFilters } from './RecipeFilters';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
}

export function RecipeList({ recipes, favorites, onToggleFavorite }: RecipeListProps) {
  const [sortBy, setSortBy] = React.useState<'popular' | 'calories' | 'time' | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState('Todas');
  const [selectedMealType, setSelectedMealType] = React.useState<'all' | MealType>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAndSortedRecipes = React.useMemo(() => {
    let filtered = [...recipes];

    // Aplicar filtros
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedMealType !== 'all') {
      filtered = filtered.filter(recipe => recipe.meal_type === selectedMealType);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(search) ||
        recipe.category.toLowerCase().includes(search) ||
        recipe.recipe_ingredients?.some(ri => 
          ri.ingredients?.name.toLowerCase().includes(search)
        )
      );
    }

    // Aplicar ordenamiento
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'time': {
            const timeA = parsePreparationTime(a.prep_time || '');
            const timeB = parsePreparationTime(b.prep_time || '');
            return timeA - timeB;
          }
          case 'calories': {
            const calA = Number(a.calories?.replace(/[^\d.-]/g, '')) || 999999;
            const calB = Number(b.calories?.replace(/[^\d.-]/g, '')) || 999999;
            return calA - calB;
          }
          case 'popular': {
            // Si tienes un campo de popularidad, úsalo aquí
            return 0;
          }
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [recipes, selectedCategory, selectedMealType, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            favorites={favorites}
            onClick={() => {}}
            onToggleFavorite={() => onToggleFavorite(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}