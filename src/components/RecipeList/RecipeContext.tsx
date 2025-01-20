import { Recipe } from '../../types';
import { ChefHat } from 'lucide-react';
import { RecipeList } from './index';

interface RecipeContentProps {
  loading: boolean;
  error: any;
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeContent = ({
  loading,
  error,
  recipes,
  onRecipeSelect,
  favorites,
  onToggleFavorite
}: RecipeContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <ChefHat size={32} className="mx-auto mb-4 text-rose-500 animate-bounce" />
          <p className="text-gray-600">Cargando recetas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600">Error al cargar las recetas: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <RecipeList
      recipes={recipes}
      onRecipeSelect={onRecipeSelect}
      favorites={favorites.map(f => ({ recipe_id: f }))}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

export default RecipeContent; 