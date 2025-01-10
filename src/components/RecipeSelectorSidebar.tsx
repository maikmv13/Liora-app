import React, { useState } from 'react';
import { X, Search, ChevronRight, Filter } from 'lucide-react';
import { Recipe } from '../types';
import { sampleRecipes } from '../data/recipes';

interface RecipeSelectorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  selectedDay: string;
  selectedMeal: 'comida' | 'cena';
}

const categories = [
  'Todas',
  'Carnes',
  'Pescados',
  'Vegetariano',
  'Pasta',
  'Arroces',
  'Sopas',
  'Ensaladas'
];

export function RecipeSelectorSidebar({ 
  isOpen, 
  onClose, 
  onSelectRecipe,
  selectedDay,
  selectedMeal
}: RecipeSelectorSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = sampleRecipes.filter(recipe => {
    const matchesSearch = recipe.Plato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || recipe.Categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Cambiar {selectedMeal}</h2>
              <p className="text-sm text-gray-500">{selectedDay}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Filter size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
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
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {recipe.Plato}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{recipe.Acompañamiento}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {recipe.Categoria}
                    </span>
                    <span className="text-sm text-gray-500">{recipe.Calorias}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}