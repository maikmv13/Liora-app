import React, { useState } from 'react';
import { Recipe, MealType, meal_category } from '../../types';
import { RecipeCard } from '../RecipeCard';
import { ChefHat } from 'lucide-react';
import { RecipeFilters } from './RecipeFilters';

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
      {/* ... resto del código ... */}

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
              image_url: recipe.image_url,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              isFavorite: recipe.isFavorite
            }}
            onClick={() => onRecipeSelect(recipe)}
            onToggleFavorite={() => onToggleFavorite(recipe)}
          />
        ))}
      </div>

      {/* ... resto del código ... */}
    </div>
  );
}