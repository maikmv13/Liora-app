import React, { useState } from 'react';
import { X, Search, ChevronRight, Filter, Flame, Users, Clock } from 'lucide-react';
import { Recipe } from '../../types';
import { sampleRecipes } from '../../data/recipes';

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
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`absolute inset-y-0 right-0 w-full md:w-96 bg-white/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
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
                  className="flex flex-col p-3 rounded-xl hover:bg-rose-50/50 transition-colors text-left group border border-transparent hover:border-rose-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                        {recipe.Plato}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.Acompañamiento}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
                      {recipe.Categoria}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-rose-500">
                      <Flame size={14} />
                      <span>{recipe.Calorias}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users size={14} />
                      <span>{recipe.Comensales} pers.</span>
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{recipe["Tiempo de preparación"] || "30 min"}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}