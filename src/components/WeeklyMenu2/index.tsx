import React, { useState, useEffect } from 'react';
import { Recipe, MenuItem } from '../../types';
import { Header } from './Header';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { RecipeModal } from '../RecipeModal';
import { weekDays } from './utils';
import { sampleRecipes } from '../../data/recipes';

interface WeeklyMenu2Props {
  weeklyMenu: MenuItem[];
  onRecipeSelect: (recipe: Recipe) => void;
  onAddToMenu: (recipe: Recipe | null, day: string, meal: 'comida' | 'cena') => void;
}

export function WeeklyMenu2({ weeklyMenu, onRecipeSelect, onAddToMenu }: WeeklyMenu2Props) {
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: 'comida' | 'cena';
  } | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<MenuItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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

  const handleViewRecipe = (menuItem: MenuItem) => {
    setViewingRecipe(menuItem);
  };

  const handleGenerateMenu = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Limpiar el menú actual
      for (const day of weekDays) {
        for (const meal of ['comida', 'cena'] as const) {
          onAddToMenu(null, day, meal);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
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

      // Guardar la fecha de generación
      const now = new Date().toISOString();
      localStorage.setItem('lastMenuGenerated', now);
      setLastGenerated(now);
    } catch (error) {
      console.error('Error generating menu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const today = new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());

    let menuContent;
    if (selectedDay) {
      // Menú diario
      const dayMenu = weeklyMenu.filter(item => item.day === selectedDay);
      const comida = dayMenu.find(item => item.meal === 'comida');
      const cena = dayMenu.find(item => item.meal === 'cena');
      
      menuContent = `🍽️ *Menú para ${selectedDay}*\n📅 Generado el ${today}\n\n` +
        `${comida ? `🍳 *Comida:* ${comida.recipe.Plato}\n` : ''}` +
        `${cena ? `🌙 *Cena:* ${cena.recipe.Plato}\n` : ''}`;
    } else {
      // Menú semanal
      menuContent = `🍽️ *Menú Semanal*\n📅 Generado el ${today}\n\n` + 
        weekDays.map(day => {
          const dayMenu = weeklyMenu.filter(item => item.day === day);
          const comida = dayMenu.find(item => item.meal === 'comida');
          const cena = dayMenu.find(item => item.meal === 'cena');
          
          return `*${day}*\n${comida ? `🍳 Comida: ${comida.recipe.Plato}\n` : ''}${cena ? `🌙 Cena: ${cena.recipe.Plato}\n` : ''}\n`;
        }).join('');
    }

    const encodedMessage = encodeURIComponent(menuContent);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Header 
        onGenerateMenu={handleGenerateMenu}
        onExport={handleExport}
        isGenerating={isGenerating}
        lastGenerated={lastGenerated ? formatDate(new Date(lastGenerated)) : null}
      />

      <div className="hidden md:block">
        <DesktopView
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMeal}
          onViewRecipe={handleViewRecipe}
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
          onViewRecipe={handleViewRecipe}
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

      {viewingRecipe && (
        <RecipeModal
          recipe={viewingRecipe.recipe}
          onClose={() => setViewingRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}
    </div>
  );
}