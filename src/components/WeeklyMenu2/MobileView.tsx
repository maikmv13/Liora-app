import React, { useRef, useEffect } from 'react';
import { MenuItem, MealType, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { DayCard } from './DayCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS, WeekDay } from './constants';
import { NextWeekCard } from './NextWeekCard';

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
  const [isScrolling, setIsScrolling] = React.useState(false);

  // Función para obtener el día siguiente al actual
  const getTomorrowDay = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(tomorrow)
      .replace(/^\w/, c => c.toUpperCase()); // Capitalizar primera letra
  };

  // Función para obtener el índice del día siguiente
  const getTomorrowIndex = () => {
    const tomorrow = getTomorrowDay();
    return weekDays.findIndex(day => day === tomorrow);
  };

  // Scroll automático al día siguiente al montar el componente
  useEffect(() => {
    if (scrollContainerRef.current) {
      const tomorrowIndex = getTomorrowIndex();
      if (tomorrowIndex !== -1) {
        const cardWidth = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
          left: tomorrowIndex * cardWidth,
          behavior: 'smooth'
        });
        onDayChange(weekDays[tomorrowIndex]);
      }
    }
  }, []); // Solo se ejecuta al montar el componente

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
            className="flex-none w-full snap-center px-2 first:pl-4 last:pr-2 transition-transform duration-300"
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
        
        <div className="flex-none w-full snap-center px-2 pr-4 transition-transform duration-300 md:hidden">
          <NextWeekCard />
        </div>
      </div>

      {/* Day Indicators */}
      <div className="flex justify-center space-x-1 mt-4 md:hidden">
        {weekDays.concat(['next']).map((day, index) => {
          const isNextWeek = day === 'next';
          const isSelected = isNextWeek ? 
            Math.round(scrollContainerRef.current?.scrollLeft ?? 0) === (weekDays.length * (scrollContainerRef.current?.clientWidth ?? 0)) : 
            selectedDay === day;

          return (
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
                  if (!isNextWeek) {
                    onDayChange(day as WeekDay);
                  }
                  setTimeout(() => setIsScrolling(false), 300);
                }
              }}
              disabled={isScrolling}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isSelected
                  ? isNextWeek 
                    ? 'bg-orange-500 w-4'
                    : 'bg-rose-500 w-4'
                  : isScrolling
                    ? 'bg-rose-200 cursor-not-allowed'
                    : 'bg-rose-200 hover:bg-rose-300'
                }
              `}
              aria-label={isNextWeek ? 'Próxima semana' : `Ir a ${day}`}
            />
          );
        })}
      </div>
    </div>
  );
}