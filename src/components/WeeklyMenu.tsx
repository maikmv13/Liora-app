import React, { useState } from 'react';
import { Calendar, Download, Utensils, Moon, Plus, X, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import { Recipe, MenuItem } from '../types';
import { sampleRecipes } from '../data/recipes';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';

interface WeeklyMenuProps {
  weeklyMenu: MenuItem[];
  onRecipeSelect: (recipe: Recipe) => void;
  onAddToMenu: (recipe: Recipe, day: string, meal: 'comida' | 'cena') => void;
}

const weekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

const getMealIcon = (meal: string) => {
  switch (meal) {
    case 'comida':
      return <Utensils size={16} className="text-emerald-500" />;
    case 'cena':
      return <Moon size={16} className="text-emerald-500" />;
    default:
      return null;
  }
};

export function WeeklyMenu({ weeklyMenu, onRecipeSelect, onAddToMenu }: WeeklyMenuProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ day: string; meal: string } | null>(null);
  const [currentView, setCurrentView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [showNutritionInfo, setShowNutritionInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: 'comida' | 'cena';
  } | null>(null);

  const handleMealClick = (day: string, meal: 'comida' | 'cena') => {
    setSelectedMealInfo({ day, meal });
    setSidebarOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (selectedMealInfo) {
      onAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
    }
  };

  const renderMobileView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const prevIndex = (currentIndex - 1 + weekDays.length) % weekDays.length;
              setSelectedDay(weekDays[prevIndex]);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{selectedDay}</h3>
          <button
            onClick={() => {
              const currentIndex = weekDays.indexOf(selectedDay);
              const nextIndex = (currentIndex + 1) % weekDays.length;
              setSelectedDay(weekDays[nextIndex]);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {['comida', 'cena'].map((meal) => {
        const menuItem = weeklyMenu.find(
          item => item.day === selectedDay && item.meal === meal
        );

        return (
          <div key={meal} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-gray-600">
                {getMealIcon(meal)}
                <span className="font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
              </div>
              {menuItem && (
                <button
                  onClick={() => onAddToMenu(sampleRecipes[0], selectedDay, meal as 'comida' | 'cena')}
                  className="p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={16} className="text-red-500" />
                </button>
              )}
            </div>
            {menuItem ? (
              <div
                onClick={() => handleMealClick(selectedDay, meal as 'comida' | 'cena')}
                className="cursor-pointer"
              >
                <p className="font-medium text-gray-900">{menuItem.recipe.Plato}</p>
                <p className="text-sm text-gray-500 mt-1">{menuItem.recipe.Calorias}</p>
              </div>
            ) : (
              <button
                onClick={() => handleMealClick(selectedDay, meal as 'comida' | 'cena')}
                className="w-full py-2 text-emerald-600 text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Plus size={16} />
                <span>Añadir plato</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderDesktopView = () => (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map(day => (
        <div key={day} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">{day}</h3>
          </div>
          <div className="space-y-1">
            {['comida', 'cena'].map((meal) => {
              const menuItem = weeklyMenu.find(
                item => item.day === day && item.meal === meal
              );
              const isHovered = hoveredCell?.day === day && hoveredCell?.meal === meal;

              return (
                <div 
                  key={meal}
                  className="relative"
                  onMouseEnter={() => setHoveredCell({ day, meal })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {menuItem ? (
                    <div 
                      className="p-3 cursor-pointer group"
                      onClick={() => handleMealClick(day, meal as 'comida' | 'cena')}
                    >
                      <div className="flex items-center space-x-2 mb-1 text-gray-600">
                        {getMealIcon(meal)}
                        <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {menuItem.recipe.Plato}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{menuItem.recipe.Calorias}</p>
                      
                      {isHovered && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToMenu(sampleRecipes[0], day, meal as 'comida' | 'cena');
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMealClick(day, meal as 'comida' | 'cena')}
                      className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2 mb-1 text-gray-400">
                        {getMealIcon(meal)}
                        <span className="text-xs font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Plus size={14} />
                        <span className="text-xs font-medium">Añadir plato</span>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Menú Semanal</h2>
            <p className="text-gray-600 mt-1">Planifica tus comidas para la semana</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                // Aquí iría la lógica para generar el menú automático
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Wand2 size={20} />
              <span>Generar Menú</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
              <Download size={20} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          {renderDesktopView()}
        </div>
        <div className="md:hidden">
          {renderMobileView()}
        </div>
      </div>

      {selectedMealInfo && (
        <RecipeSelectorSidebar
          isOpen={sidebarOpen}
          onClose={() => {
            setSidebarOpen(false);
            setSelectedMealInfo(null);
          }}
          onSelectRecipe={handleRecipeSelect}
          selectedDay={selectedMealInfo.day}
          selectedMeal={selectedMealInfo.meal}
        />
      )}
    </>
  );
}