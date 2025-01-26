import React from 'react';
import { Heart } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from '../RecipeList/RecipeCard';

interface RecipeGridProps {
  recipes: FavoriteRecipe[];
  onRemoveFavorite: (recipe: FavoriteRecipe) => Promise<void>;
}

export function RecipeGrid({ recipes, onRemoveFavorite }: RecipeGridProps) {
  if (!recipes?.length) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/20">
        <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-rose-500" />
        </div>
        <p className="text-gray-900 font-medium">
          No hay recetas favoritas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard
          key={`${recipe.id}-${recipe.favorite_id}`}
          recipe={recipe}
          favorites={recipes.map(f => f.favorite_id)}
          onToggleFavorite={() => onRemoveFavorite(recipe)}
        />
      ))}
    </div>
  );
} 