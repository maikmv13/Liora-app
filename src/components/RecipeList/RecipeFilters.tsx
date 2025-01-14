import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { MealType } from '../../types';
import { categories, mealTypes } from '../../types/categories';

interface RecipeFiltersProps {
  selectedCategory: string;
  selectedMealType: 'all' | MealType;
  sortBy: 'popular' | 'calories' | 'time' | null;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onMealTypeChange: (mealType: 'all' | MealType) => void;
  onSortChange: (sort: 'popular' | 'calories' | 'time' | null) => void;
  onSearchChange: (search: string) => void;
}

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
  const mealTypesRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);

  // State to track if scrolling is possible
  const [canScrollMealTypes, setCanScrollMealTypes] = useState({ left: false, right: false });
  const [canScrollCategories, setCanScrollCategories] = useState({ left: false, right: false });
  const [canScrollSortBy, setCanScrollSortBy] = useState({ left: false, right: false });

  // Check if scrolling is possible
  const checkScroll = (ref: React.RefObject<HTMLDivElement>, setCanScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setCanScroll({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1 // -1 for rounding errors
      });
    }
  };

  // Add scroll event listeners
  useEffect(() => {
    const mealTypesElement = mealTypesRef.current;
    const categoriesElement = categoriesRef.current;
    const sortByElement = sortByRef.current;

    const handleScroll = (ref: React.RefObject<HTMLDivElement>, setCanScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
      checkScroll(ref, setCanScroll);
    };

    // Initial check
    checkScroll(mealTypesRef, setCanScrollMealTypes);
    checkScroll(categoriesRef, setCanScrollCategories);
    checkScroll(sortByRef, setCanScrollSortBy);

    // Add listeners
    if (mealTypesElement) {
      mealTypesElement.addEventListener('scroll', () => handleScroll(mealTypesRef, setCanScrollMealTypes));
    }
    if (categoriesElement) {
      categoriesElement.addEventListener('scroll', () => handleScroll(categoriesRef, setCanScrollCategories));
    }
    if (sortByElement) {
      sortByElement.addEventListener('scroll', () => handleScroll(sortByRef, setCanScrollSortBy));
    }

    // Cleanup
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
        <button
          onClick={(e) => {
            e.preventDefault();
            scroll(scrollRef, 'left');
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white/90 rounded-full shadow-lg border border-rose-100 text-rose-500 transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canScroll.right && (
        <button
          onClick={(e) => {
            e.preventDefault();
            scroll(scrollRef, 'right');
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 hover:bg-white/90 rounded-full shadow-lg border border-rose-100 text-rose-500 transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre, categoría..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
        <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Scrollable Filters */}
      <div className="space-y-3">
        {/* Meal Types - First row */}
        <div className="relative">
          <div
            ref={mealTypesRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => onMealTypeChange('all')}
              className={`flex-none px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedMealType === 'all'
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-200 shadow-sm transform scale-105'
                  : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <span>🍽️</span>
                <span>Todas</span>
              </span>
            </button>
            {mealTypes.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => onMealTypeChange(id)}
                className={`flex-none px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedMealType === id
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-200 shadow-sm transform scale-105'
                    : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </span>
              </button>
            ))}
          </div>
          <ScrollButtons scrollRef={mealTypesRef} canScroll={canScrollMealTypes} />
        </div>

        {/* Categories - Second row */}
        <div className="relative">
          <div
            ref={categoriesRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => onCategoryChange(id)}
                className={`flex-none px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === id
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-200 shadow-sm transform scale-105'
                    : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </span>
              </button>
            ))}
          </div>
          <ScrollButtons scrollRef={categoriesRef} canScroll={canScrollCategories} />
        </div>

        {/* Sort Options - Third row */}
        <div className="relative">
          <div
            ref={sortByRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { id: null, label: 'Más recientes', emoji: '🕒' },
              { id: 'popular', label: 'Más populares', emoji: '⭐' },
              { id: 'calories', label: 'Calorías', emoji: '🔥' },
              { id: 'time', label: 'Tiempo', emoji: '⏱️' }
            ].map(({ id, label, emoji }) => (
              <button
                key={label}
                onClick={() => onSortChange(id as 'popular' | 'calories' | 'time' | null)}
                className={`flex-none px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  sortBy === id
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-200 shadow-sm transform scale-105'
                    : 'bg-white/80 text-gray-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </span>
              </button>
            ))}
          </div>
          <ScrollButtons scrollRef={sortByRef} canScroll={canScrollSortBy} />
        </div>
      </div>
    </div>
  );
}