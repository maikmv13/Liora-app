import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import type { Recipe, FavoriteRecipe } from '../../types';
import { HeroImage } from './components/HeroImage';
import { QuickInfo } from './components/QuickInfo';
import { NutritionalInfo } from './components/NutritionalInfo';
import { Ingredients } from './components/Ingredients';
import { Instructions } from './components/Instructions';
import { RecipeQA } from './components/RecipeQA';
import { supabase } from '../../lib/supabase';

interface RecipeDetailProps {
  recipes: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  favorites: FavoriteRecipe[];
}

export function RecipeDetail({ recipes, onToggleFavorite, favorites }: RecipeDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const isFavorite = favorites.some(f => f.recipe_id === id);
  const [expandedSection, setExpandedSection] = useState<'ingredients' | 'instructions' | 'nutrition' | null>('ingredients');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;

      try {
        const { data: recipeData, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients(
              id,
              quantity,
              unit,
              ingredient:ingredients(
                id,
                name,
                category
              )
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching recipe:', error);
          return;
        }

        if (recipeData) {
          setRecipe(recipeData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 to-orange-50/50">
      <HeroImage 
        recipe={recipe}
        onToggleFavorite={() => onToggleFavorite(recipe)}
        isFavorite={isFavorite}
      />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <QuickInfo recipe={recipe} />

        <NutritionalInfo 
          recipe={recipe}
          isExpanded={expandedSection === 'nutrition'}
          onToggle={() => setExpandedSection(
            expandedSection === 'nutrition' ? null : 'nutrition'
          )}
        />

        <Ingredients recipe={recipe} />

        <Instructions recipe={recipe} />
      </div>

      <div className="pb-0">
        <RecipeQA recipe={recipe} />
      </div>
    </div>
  );
}

export default RecipeDetail;