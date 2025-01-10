import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, Filter, Flame } from 'lucide-react';
import { Recipe } from '../../types';
import { useRecipes } from '../../hooks/useRecipes';

const categories = [
  'Todas',
  'Aves',
  'Carnes',
  'Ensaladas',
  'Fast Food',
  'Legumbres',
  'Pastas y Arroces',
  'Pescados',
  'Sopas y Cremas',
  'Vegetariano'
];

interface RecipeSelectorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  selectedDay: string;
  selectedMeal: 'comida' | 'cena';
}

export function RecipeSelectorSidebar({ 
  isOpen, 
  onClose, 
  onSelectRecipe,
  selectedDay,
  selectedMeal
}: RecipeSelectorSidebarProps) {
  const { recipes, loading } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.Plato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || recipe.Categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cambiar {selectedMeal}</h2>
              <p className="text-sm text-gray-500">{selectedDay}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-2 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Filter size={18} className="text-rose-500" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-rose-50">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2 p-4">
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.Plato}
                onClick={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                className="flex items-start p-3 rounded-xl hover:bg-rose-50/50 transition-colors text-left group border border-transparent hover:border-rose-100"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {recipe.Plato}
                  </h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
                      {recipe.Categoria}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-rose-500">
                      <Flame size={14} />
                      <span>{recipe.Calorias}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}