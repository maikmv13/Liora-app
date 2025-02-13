import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import { MealType } from '../../types';
import { categories, mealTypes } from '../../types/categories';
import { motion } from 'framer-motion';

interface RecipeFiltersProps {
  selectedCategory: string;
  selectedMealType: 'all' | MealType;
  sortBy: 'popular' | 'calories' | 'time' | null;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onMealTypeChange: (mealType: 'all' | MealType) => void;
  onSortChange: (sort: 'popular' | 'calories' | 'time' | null) => void;
  onSearchChange: (search: string) => void;
  recipes: any[]; // Assuming the type of recipes
}

export function RecipeFilters({
  selectedCategory,
  selectedMealType,
  sortBy,
  searchTerm,
  onCategoryChange,
  onMealTypeChange,
  onSortChange,
  onSearchChange,
  recipes
}: RecipeFiltersProps) {
  const mealTypesRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);

  const [canScrollMealTypes, setCanScrollMealTypes] = useState({ left: false, right: false });
  const [canScrollCategories, setCanScrollCategories] = useState({ left: false, right: false });
  const [canScrollSortBy, setCanScrollSortBy] = useState({ left: false, right: false });

  const checkScroll = (ref: React.RefObject<HTMLDivElement>, setCanScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setCanScroll({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1
      });
    }
  };

  useEffect(() => {
    const mealTypesElement = mealTypesRef.current;
    const categoriesElement = categoriesRef.current;
    const sortByElement = sortByRef.current;

    const handleScroll = (ref: React.RefObject<HTMLDivElement>, setCanScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
      checkScroll(ref, setCanScroll);
    };

    checkScroll(mealTypesRef, setCanScrollMealTypes);
    checkScroll(categoriesRef, setCanScrollCategories);
    checkScroll(sortByRef, setCanScrollSortBy);

    if (mealTypesElement) {
      mealTypesElement.addEventListener('scroll', () => handleScroll(mealTypesRef, setCanScrollMealTypes));
    }
    if (categoriesElement) {
      categoriesElement.addEventListener('scroll', () => handleScroll(categoriesRef, setCanScrollCategories));
    }
    if (sortByElement) {
      sortByElement.addEventListener('scroll', () => handleScroll(sortByRef, setCanScrollSortBy));
    }

    return () => {
      if (mealTypesElement) {
        mealTypesElement.removeEventListener('scroll', () => handleScroll(mealTypesRef, setCanScrollMealTypes));
      }
      if (categoriesElement) {
        categoriesElement.removeEventListener('scroll', () => handleScroll(categoriesRef, setCanScrollCategories));
      }
      if (sortByElement) {
        sortByElement.removeEventListener('scroll', () => handleScroll(sortByRef, setCanScrollSortBy));
      }
    };
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? ref.current.scrollLeft - scrollAmount
      : ref.current.scrollLeft + scrollAmount;
    
    ref.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const ScrollButtons = ({ 
    scrollRef, 
    canScroll 
  }: { 
    scrollRef: React.RefObject<HTMLDivElement>;
    canScroll: { left: boolean; right: boolean };
  }) => (
    <>
      {canScroll.left && (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={(e) => {
            e.preventDefault();
            scroll(scrollRef, 'left');
          }}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full border border-rose-100/50 text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </motion.button>
      )}
      {canScroll.right && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={(e) => {
            e.preventDefault();
            scroll(scrollRef, 'right');
          }}
          className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full border border-rose-100/50 text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </motion.button>
      )}
    </>
  );

  const getMealTypeIcon = (mealType: string) => {
    switch(mealType) {
      case 'desayuno':
        return <Coffee size={16} className="text-orange-500" />;
      case 'comida':
        return <Sun size={16} className="text-amber-500" />;
      case 'cena':
        return <Moon size={16} className="text-indigo-500" />;
      case 'snack':
        return <Cookie size={16} className="text-rose-500" />;
      default:
        return null;
    }
  };

  const getMealTypeColors = (mealType: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-rose-100/50';
    
    switch(mealType) {
      case 'desayuno':
        return 'bg-orange-100/80 text-orange-600 shadow-sm border border-orange-200/50';
      case 'comida':
        return 'bg-amber-100/80 text-amber-600 shadow-sm border border-amber-200/50';
      case 'cena':
        return 'bg-indigo-100/80 text-indigo-600 shadow-sm border border-indigo-200/50';
      case 'snack':
        return 'bg-rose-100/80 text-rose-600 shadow-sm border border-rose-200/50';
      default:
        return 'bg-rose-100/80 text-rose-600 shadow-sm border border-rose-200/50';
    }
  };

  // Obtener categorías disponibles basadas en el tipo de comida seleccionado
  const availableCategories = React.useMemo(() => {
    if (selectedMealType === 'all') {
      return categories; // Mostrar todas las categorías
    }

    // Filtrar recetas por tipo de comida
    const filteredRecipes = recipes.filter(recipe => 
      recipe.meal_type === selectedMealType
    );

    // Obtener categorías únicas de las recetas filtradas
    const uniqueCategories = [...new Set(
      filteredRecipes.map(recipe => recipe.category)
    )];

    // Mantener solo las categorías que existen en nuestro array de categorías predefinidas
    return categories.filter(cat => 
      uniqueCategories.includes(cat.id)
    );
  }, [selectedMealType, recipes]);

  // Seleccionar automáticamente la primera categoría disponible cuando cambia el meal type
  React.useEffect(() => {
    if (availableCategories.length > 0) {
      const currentCategoryExists = availableCategories.some(cat => cat.id === selectedCategory);
      if (!currentCategoryExists) {
        // Si la categoría actual no está disponible, seleccionar la primera o "Todas"
        onCategoryChange(availableCategories[0]?.id || 'Todas');
      }
    }
  }, [selectedMealType, availableCategories, selectedCategory, onCategoryChange]);

  // Manejador modificado para el cambio de meal type
  const handleMealTypeChange = (mealType: 'all' | MealType) => {
    onMealTypeChange(mealType);
    // La categoría se actualizará automáticamente gracias al useEffect
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre, ingrediente o categoría..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
        <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Scrollable Filters */}
      <div className="space-y-2">
        {/* Meal Types */}
        <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-1">
          <div
            ref={mealTypesRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide pl-1 pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMealTypeChange('all')}
              className={`flex-none px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedMealType === 'all'
                  ? 'bg-rose-100/80 text-rose-600 shadow-sm border border-rose-200/50'
                  : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-rose-100/50'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <span>🍽️</span>
                <span>Todas</span>
              </span>
            </motion.button>
            {mealTypes.map(({ id, label }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMealTypeChange(id)}
                className={`flex-none px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  getMealTypeColors(id, selectedMealType === id)
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  {getMealTypeIcon(id)}
                  <span>{label}</span>
                </span>
              </motion.button>
            ))}
          </div>
          <ScrollButtons scrollRef={mealTypesRef} canScroll={canScrollMealTypes} />
        </div>

        {/* Categories */}
        <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-1">
          <div
            ref={categoriesRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide pl-1 pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {availableCategories.map(({ id, label, emoji }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(id)}
                className={`flex-none px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === id
                    ? 'bg-rose-100/80 text-rose-600 shadow-sm border border-rose-200/50'
                    : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-rose-100/50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </span>
              </motion.button>
            ))}
          </div>
          <ScrollButtons scrollRef={categoriesRef} canScroll={canScrollCategories} />
        </div>

        {/* Sort Options */}
        <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-1">
          <div
            ref={sortByRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide pl-1 pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { id: null, label: 'Más recientes', emoji: '🕒' },
              { id: 'popular', label: 'Más populares', emoji: '⭐' },
              { id: 'calories', label: 'Menos calorías', emoji: '🔥' },
              { id: 'time', label: 'Menos tiempo', emoji: '⏱️' }
            ].map(({ id, label, emoji }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSortChange(id as 'popular' | 'calories' | 'time' | null)}
                className={`flex-none px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  sortBy === id
                    ? 'bg-rose-100/80 text-rose-600 shadow-sm border border-rose-200/50'
                    : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-rose-100/50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </span>
              </motion.button>
            ))}
          </div>
          <ScrollButtons scrollRef={sortByRef} canScroll={canScrollSortBy} />
        </div>
      </div>
    </div>
  );
}