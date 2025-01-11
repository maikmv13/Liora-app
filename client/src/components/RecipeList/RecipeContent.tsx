import { Recipe } from '../../types';
import { ChefHat } from 'lucide-react';
import { RecipeList } from '../RecipeList';

interface RecipeContentProps {
  loading: boolean;
  error: Error | null;
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeContent({ loading, error, recipes, onRecipeSelect, favorites, onToggleFavorite }: RecipeContentProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <ChefHat size={32} className="mx-auto animate-spin text-rose-500" />
        <p className="mt-4 text-gray-600">Cargando recetas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error al cargar las recetas: {error.message}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontraron recetas</p>
      </div>
    );
  }

  return (
    <RecipeList 
      recipes={recipes}
      onRecipeSelect={onRecipeSelect}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
} 