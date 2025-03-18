import { Heart } from 'lucide-react';
import { FavoriteRecipe } from '../../types';
import { RecipeCard } from '../RecipeList/RecipeCard';

interface RecipeGridProps {
  recipes: FavoriteRecipe[];
  onRemoveFavorite: (recipe: FavoriteRecipe) => Promise<void>;
}

export function RecipeGrid({ recipes, onRemoveFavorite }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Heart className="h-10 w-10 text-gray-300" />
        <h3 className="mt-4 text-base font-medium text-gray-900">No hay recetas favoritas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Explora recetas y añade tus favoritas para verlas aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          favorites={recipes.map(f => f.id)}
          onToggleFavorite={() => onRemoveFavorite(recipe)}
        />
      ))}
    </div>
  );
} 