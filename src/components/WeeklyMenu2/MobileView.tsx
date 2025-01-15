import React, { useRef, useEffect } from 'react';
import { MenuItem, MealType, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { DayCard } from './DayCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS, WeekDay } from './constants';

interface MobileViewProps {
  selectedDay: WeekDay;
  weekDays: readonly WeekDay[];
  weeklyMenu: MenuItem[];
  onDayChange: (day: WeekDay) => void;
  onMealClick: (day: WeekDay, meal: MealType) => void;
  onRemoveMeal: (day: WeekDay, meal: MealType) => void;
  onViewRecipe: (menuItem: MenuItem) => void;
  onAddToMenu: (recipe: Recipe | null, day: WeekDay, meal: MealType) => void;
  activeMenu: ExtendedWeeklyMenuDB | null;
  initialDay?: string;
}

export function MobileView({ 
  selectedDay, 
  weekDays, 
  weeklyMenu,
  onDayChange,
  onMealClick,
  onRemoveMeal,
  onViewRecipe,
  onAddToMenu,
  activeMenu,
  initialDay
}: MobileViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  // Función para actualizar el día seleccionado basado en el scroll
  const updateSelectedDay = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const dayIndex = Math.round(scrollLeft / clientWidth);
      const newSelectedDay = weekDays[dayIndex];
      if (newSelectedDay && newSelectedDay !== selectedDay) {
        onDayChange(newSelectedDay);
      }
    }
  };

  // Función para comprobar scroll y actualizar día seleccionado
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      updateSelectedDay();
    }
  };

  // Añadir listener de scroll con debounce
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      let scrollTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        checkScroll();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateSelectedDay, 150); // Debounce de 150ms
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      checkScroll(); // Comprobar estado inicial

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [selectedDay, weekDays]);

  // Función para hacer scroll con animación suave
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true);
      const scrollAmount = scrollContainerRef.current.clientWidth;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Actualizar el día seleccionado después del scroll
      setTimeout(() => {
        updateSelectedDay();
        setIsScrolling(false);
      }, 300); // Ajustar este tiempo según la duración de la animación
    }
  };

  React.useEffect(() => {
    if (scrollContainerRef.current && initialDay) {
      const index = weekDays.findIndex(day => 
        day.toLowerCase() === initialDay.toLowerCase()
      );
      if (index !== -1) {
        const cardWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollLeft = index * cardWidth;
      }
    }
  }, [initialDay, weekDays]);

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          disabled={isScrolling}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 z-10 
            p-2 bg-white/80 hover:bg-white/90 
            rounded-full shadow-lg border border-rose-100 
            text-rose-500 transition-all duration-300
            ${isScrolling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          disabled={isScrolling}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 z-10 
            p-2 bg-white/80 hover:bg-white/90 
            rounded-full shadow-lg border border-rose-100 
            text-rose-500 transition-all duration-300
            ${isScrolling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Days Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 -mx-4 pb-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {weekDays.map(day => (
          <div 
            key={day}
            className="flex-none w-full snap-center px-2 first:pl-4 last:pr-4 transition-transform duration-300"
          >
            <DayCard
              day={day}
              menuItems={weeklyMenu.filter(item => item.day === day)}
              onMealClick={(meal) => onMealClick(day, meal)}
              onRemoveMeal={(meal) => onRemoveMeal(day, meal)}
              onViewRecipe={onViewRecipe}
              onAddToMenu={onAddToMenu}
              activeMenu={activeMenu}
            />
          </div>
        ))}
      </div>

      {/* Day Indicators */}
      <div className="flex justify-center space-x-1 mt-4">
        {weekDays.map((day, index) => (
          <button
            key={day}
            onClick={() => {
              if (scrollContainerRef.current && !isScrolling) {
                setIsScrolling(true);
                const cardWidth = scrollContainerRef.current.clientWidth;
                scrollContainerRef.current.scrollTo({
                  left: index * cardWidth,
                  behavior: 'smooth'
                });
                onDayChange(day);
                setTimeout(() => setIsScrolling(false), 300);
              }
            }}
            disabled={isScrolling}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${selectedDay === day
                ? 'bg-rose-500 w-4'
                : isScrolling
                  ? 'bg-rose-200 cursor-not-allowed'
                  : 'bg-rose-200 hover:bg-rose-300'
              }
            `}
            aria-label={`Ir a ${day}`}
          />
        ))}
      </div>
    </div>
  );
}