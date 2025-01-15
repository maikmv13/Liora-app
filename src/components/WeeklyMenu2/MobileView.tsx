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
  activeMenu
}: MobileViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Función para comprobar si se puede hacer scroll
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 para evitar errores de redondeo
    }
  };

  // Añadir listener de scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Comprobar scroll inicial
      checkScroll();
      
      // Scroll al día seleccionado
      const selectedDayIndex = weekDays.indexOf(selectedDay);
      const cardWidth = scrollContainer.clientWidth;
      scrollContainer.scrollTo({
        left: selectedDayIndex * cardWidth,
        behavior: 'smooth'
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [selectedDay, weekDays]);

  // Función para hacer scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg border border-rose-100 text-rose-500 transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg border border-rose-100 text-rose-500 transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Days Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 -mx-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {weekDays.map(day => (
          <div 
            key={day}
            className="flex-none w-full snap-center px-2 first:pl-4 last:pr-4"
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
              onDayChange(day);
              if (scrollContainerRef.current) {
                const cardWidth = scrollContainerRef.current.clientWidth;
                scrollContainerRef.current.scrollTo({
                  left: index * cardWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedDay === day
                ? 'bg-rose-500 w-4'
                : 'bg-rose-200 hover:bg-rose-300'
            }`}
            aria-label={`Go to ${day}`}
          />
        ))}
      </div>
    </div>
  );
}