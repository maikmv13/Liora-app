import React, { useState } from 'react';
import { Recipe, MenuItem } from '../../types';
import { Header } from './Header';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { RecipeSelectorSidebar } from '../RecipeSelectorSidebar';
import { weekDays } from './utils';
import { sampleRecipes } from '../../data/recipes';
import { generateWeeklyMenu } from '../../utils/menuGenerator';

interface WeeklyMenuProps {
  weeklyMenu: MenuItem[];
  onRecipeSelect: (recipe: Recipe) => void;
  onAddToMenu: (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => void;
}

export function WeeklyMenu({ weeklyMenu, onRecipeSelect, onAddToMenu }: WeeklyMenuProps) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: 'comida' | 'cena';
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMealClick = (day: string, meal: 'comida' | 'cena') => {
    setSelectedMealInfo({ day, meal });
    setSidebarOpen(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (selectedMealInfo) {
      onAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
      setSidebarOpen(false);
      setSelectedMealInfo(null);
    }
  };

  const handleRemoveMeal = (day: string, meal: 'comida' | 'cena') => {
    onAddToMenu(null, day, meal);
  };

  const handleGenerateMenu = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Limpiar el menú actual
      const clearMenu = async () => {
        for (const day of weekDays) {
          for (const meal of ['comida', 'cena'] as const) {
            onAddToMenu(null, day, meal);
            // Pequeña pausa para asegurar que el estado se actualiza
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      };

      await clearMenu();
      
      // Pequeña pausa antes de generar el nuevo menú
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generar nuevo menú
      for (const day of weekDays) {
        for (const meal of ['comida', 'cena'] as const) {
          const validRecipes = sampleRecipes.filter(recipe => {
            const isValidForMeal = meal === 'comida' 
              ? ['Carnes', 'Pescados', 'Pasta', 'Arroces'].includes(recipe.Categoria)
              : ['Pescados', 'Vegetariano', 'Pasta', 'Ensaladas', 'Sopas'].includes(recipe.Categoria);
            
            // Evitar repetir recetas que ya están en el menú
            const isNotRepeated = !weeklyMenu.some(item => item.recipe.Plato === recipe.Plato);
            
            return isValidForMeal && isNotRepeated;
          });

          if (validRecipes.length > 0) {
            const randomRecipe = validRecipes[Math.floor(Math.random() * validRecipes.length)];
            onAddToMenu(randomRecipe, day, meal);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      }
    } catch (error) {
      console.error('Error generating menu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const menuContent = weekDays.map(day => {
      const dayMenu = weeklyMenu.filter(item => item.day === day);
      const comida = dayMenu.find(item => item.meal === 'comida');
      const cena = dayMenu.find(item => item.meal === 'cena');
      
      return `${day}:\n${comida ? `Comida: ${comida.recipe.Plato}\n` : ''}${cena ? `Cena: ${cena.recipe.Plato}\n` : ''}\n`;
    }).join('\n');

    const blob = new Blob([menuContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-semanal.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Header 
        onGenerateMenu={handleGenerateMenu}
        onExport={handleExport}
        isGenerating={isGenerating}
      />

      <div className="hidden md:block">
        <DesktopView
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMeal}
        />
      </div>
      
      <div className="md:hidden">
        <MobileView
          selectedDay={selectedDay}
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onDayChange={setSelectedDay}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMeal}
        />
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
    </div>
  );
}