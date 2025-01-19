import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import type { Recipe } from '../../types';
import { HeroImage } from './components/HeroImage';
import { QuickInfo } from './components/QuickInfo';
import { NutritionalInfo } from './components/NutritionalInfo';
import { Ingredients } from './components/Ingredients';
import { Instructions } from './components/Instructions';
import { RecipeQA } from './components/RecipeQA';

interface RecipeDetailProps {
  recipes: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  favorites: Recipe[];
}

export function RecipeDetail({ recipes, onToggleFavorite, favorites }: RecipeDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === id);
  const isFavorite = favorites.some(f => f.id === id);
  const [expandedSection, setExpandedSection] = useState<'ingredients' | 'instructions' | 'nutrition' | null>('ingredients');

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ChefHat size={48} className="text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Receta no encontrada</h2>
          <p className="text-gray-600 mt-2">La receta que buscas no existe o no está disponible.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroImage 
        recipe={recipe}
        onBack={() => navigate(-1)}
        onToggleFavorite={() => onToggleFavorite(recipe)}
        isFavorite={isFavorite}
      />

      <div className="w-full">
        <QuickInfo recipe={recipe} />

        <NutritionalInfo 
          recipe={recipe}
          isExpanded={expandedSection === 'nutrition'}
          onToggle={() => setExpandedSection(
            expandedSection === 'nutrition' ? null : 'nutrition'
          )}
        />

        <Ingredients
          recipe={recipe}
          isExpanded={expandedSection === 'ingredients'}
          onToggle={() => setExpandedSection(
            expandedSection === 'ingredients' ? null : 'ingredients'
          )}
        />

        <Instructions
          recipe={recipe}
          isExpanded={expandedSection === 'instructions'}
          onToggle={() => setExpandedSection(
            expandedSection === 'instructions' ? null : 'instructions'
          )}
        />
      </div>

      <RecipeQA recipe={recipe} />
    </div>
  );
}

export default RecipeDetail;