import React from 'react';
import { ChefHat, Moon, Sun, Heart, Flame, Clock } from 'lucide-react';
import { MealType } from '../../types';

interface RecipeFiltersProps {
  selectedCategory: string;
  selectedMealType: 'all' | MealType;
  sortBy: 'popular' | 'calories' | 'time' | null;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onMealTypeChange: (type: 'all' | MealType) => void;
  onSortChange: (sort: 'popular' | 'calories' | 'time') => void;
  onSearchChange: (search: string) => void;
}

const categories = [
  { id: 'Todas', emoji: '🍽️', label: 'Todas' },
  { id: 'Aves', emoji: '🍗', label: 'Aves' },
  { id: 'Carnes', emoji: '🥩', label: 'Carnes' },
  { id: 'Ensaladas', emoji: '🥗', label: 'Ensaladas' },
  { id: 'Fast Food', emoji: '🍔', label: 'Fast Food' },
  { id: 'Legumbres', emoji: '🫘', label: 'Legumbres' },
  { id: 'Pastas y Arroces', emoji: '🍝', label: 'Pastas y Arroces' },
  { id: 'Pescados', emoji: '🐟', label: 'Pescados' },
  { id: 'Sopas y Cremas', emoji: '🥣', label: 'Sopas y Cremas' },
  { id: 'Vegetariano', emoji: '🥬', label: 'Vegetariano' }
];

const mealTypes = [
  { id: 'all', label: 'Todas', icon: ChefHat, description: 'Todas las recetas' },
  { id: 'comida', label: 'Comidas', icon: Sun, description: 'Platos principales' },
  { id: 'cena', label: 'Cenas', icon: Moon, description: 'Cenas ligeras' }
];

const sortOptions = [
  { id: 'popular', label: 'Más populares', icon: Heart },
  { id: 'calories', label: 'Menos calorías', icon: Flame },
  { id: 'time', label: 'Más rápidas', icon: Clock }
];

export function RecipeFilters({
  selectedCategory,
  selectedMealType,
  sortBy,
  searchTerm,
  onCategoryChange,
  onMealTypeChange,
  onSortChange,
  onSearchChange
}: RecipeFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 pl-12 bg-white/90 backdrop-blur-sm border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm"
        />
        <ChefHat size={20} className="absolute left-4 top-3.5 text-rose-400" />
      </div>

      {/* Filtros en scroll horizontal */}
      <div className="space-y-3">
        {/* Tipo de comida */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {mealTypes.map(type => (
            <button
              key={type.id}
              onClick={() => onMealTypeChange(type.id as 'all' | MealType)}
              className={`flex-none flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedMealType === type.id
                  ? type.id === 'comida'
                    ? 'bg-amber-100 text-amber-700 shadow-inner'
                    : type.id === 'cena'
                      ? 'bg-indigo-100 text-indigo-700 shadow-inner'
                      : 'bg-rose-100 text-rose-700 shadow-inner'
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
              }`}
            >
              <type.icon size={18} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-rose-100 text-rose-700 shadow-inner'
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
              }`}
            >
              <span>{category.emoji} {category.label}</span>
            </button>
          ))}
        </div>

        {/* Ordenar por */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id as 'popular' | 'calories' | 'time')}
              className={`flex-none flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                sortBy === option.id
                  ? 'bg-orange-100 text-orange-700 shadow-inner'
                  : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white border border-rose-100 hover:shadow-md'
              }`}
            >
              <option.icon size={18} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}