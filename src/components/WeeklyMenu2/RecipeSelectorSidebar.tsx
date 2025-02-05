import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, ChevronRight, Filter, Flame, Clock, ChefHat, Command,
  Users, Sun, Moon, Cookie, Star, Heart
} from 'lucide-react';
import { Recipe, MealType } from '../../types';
import { useRecipes } from '../../hooks/useRecipes';
import { useVirtualizer } from '@tanstack/react-virtual';
import { categories } from '../../types/categories';

interface RecipeSelectorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  selectedDay: string;
  selectedMeal: MealType;
}

// Añadir el mapa de colores para categorías
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Aves': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'Carnes': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
  'Ensaladas': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  'Fast Food': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Legumbres': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  'Pastas y Arroces': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Pescados': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  'Sopas y Cremas': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  'Vegetariano': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  'Desayuno': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  'Huevos': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Snack': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  'Otros': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' }
};

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Reset selection when filters change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, selectedCategory]);

  // Focus search input when sidebar opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Virtual list for performance
  const rowVirtualizer = useVirtualizer({
    count: filteredRecipes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredRecipes.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredRecipes[selectedIndex]) {
            onSelectRecipe(filteredRecipes[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onSelectRecipe, onClose, filteredRecipes]);

  const getImageUrl = (url: string, options: { width?: number, quality?: number, format?: string } = {}) => {
    const { width = 400, quality = 80, format = 'webp' } = options;
    return `${url}?quality=${quality}&width=${width}&format=${format}`;
  };

  const getMealIcon = () => {
    switch (selectedMeal) {
      case 'desayuno':
        return <Cookie className="w-5 h-5 text-amber-500" />;
      case 'comida':
        return <Sun className="w-5 h-5 text-orange-500" />;
      case 'snack':
        return <Cookie className="w-5 h-5 text-emerald-500" />;
      case 'cena':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getMealColor = () => {
    switch (selectedMeal) {
      case 'desayuno':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'comida':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'snack':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cena':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Función para obtener los colores de la categoría
  const getCategoryColors = (category: string) => {
    return categoryColors[category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getMealColor()}`}>
                    {getMealIcon()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                      {selectedMeal}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedDay}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Category filters */}
          {showFilters && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(({ id, label, emoji }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === id
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard shortcuts */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Command size={14} />
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">K</kbd>
                <span>para buscar</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">ESC</kbd>
                <span>para cerrar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe list */}
        <div 
          ref={parentRef}
          className="flex-1 overflow-y-auto"
        >
          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const recipe = filteredRecipes[virtualRow.index];
              return (
                <div
                  key={recipe.id}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedIndex(virtualRow.index);
                      onSelectRecipe(recipe);
                    }}
                    className={`w-full p-4 text-left transition-colors ${
                      virtualRow.index === selectedIndex
                        ? 'bg-rose-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Recipe image or placeholder */}
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {recipe.image_url ? (
                          <picture>
                            {/* WebP version */}
                            <source
                              type="image/webp"
                              srcSet={`
                                ${getImageUrl(recipe.image_url, { width: 80, format: 'webp' })} 1x,
                                ${getImageUrl(recipe.image_url, { width: 160, format: 'webp' })} 2x
                              `}
                            />
                            {/* Fallback version */}
                            <img
                              src={getImageUrl(recipe.image_url, { width: 80 })}
                              alt={recipe.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ChefHat size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Recipe details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {recipe.name}
                        </h3>
                        
                        <div className="mt-2 flex flex-col space-y-1.5">
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${
                              getCategoryColors(recipe.category).bg
                            } ${getCategoryColors(recipe.category).text} ${
                              getCategoryColors(recipe.category).border
                            }`}>
                              {recipe.category}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {recipe.calories && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                <Flame size={10} className="text-gray-500" />
                                <span>{recipe.calories} kcal</span>
                              </span>
                            )}

                            {recipe.prep_time && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                <Clock size={10} className="text-gray-500" />
                                <span>{recipe.prep_time} min</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto" />
              <p className="text-gray-500 mt-2">Cargando recetas...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredRecipes.length === 0 && (
            <div className="p-8 text-center">
              <ChefHat size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No se encontraron recetas</p>
              <p className="text-sm text-gray-500 mt-1">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}