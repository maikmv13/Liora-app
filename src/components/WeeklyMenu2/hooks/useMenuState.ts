import { useState } from 'react';
import { MenuItem, Recipe, MealType } from '../../../types';
import { ExtendedWeeklyMenuDB } from '../../../services/weeklyMenu';
import { handleUpdateMenuRecipe, handleRemoveMeal } from '../handlers';

export function useMenuState(
  forUserId: string | undefined,
  onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void
) {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: MealType;
  } | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<MenuItem | null>(null);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  const [history, setHistory] = useState<ExtendedWeeklyMenuDB[]>([]);
  const [activeMenu, setActiveMenu] = useState<ExtendedWeeklyMenuDB | null>(null);

  const handleMealClick = (day: string, meal: MealType) => {
    setSelectedMealInfo({ day, meal });
    setSidebarOpen(true);
  };

  const handleRecipeSelect = async (recipe: Recipe) => {
    if (selectedMealInfo) {
      try {
        await handleUpdateMenuRecipe(
          {
            currentMenuId,
            forUserId,
            setHistory,
            setActiveMenu,
            setCurrentMenuId,
            setIsGenerating: () => {},
            onAddToMenu
          },
          selectedMealInfo.day,
          selectedMealInfo.meal,
          recipe
        );
        setSidebarOpen(false);
        setSelectedMealInfo(null);
      } catch (error) {
        console.error('Error selecting recipe:', error);
      }
    }
  };

  const handleRemoveMealClick = async (day: string, meal: MealType) => {
    try {
      await handleRemoveMeal(
        {
          currentMenuId,
          forUserId,
          setHistory,
          setActiveMenu,
          setCurrentMenuId,
          setIsGenerating: () => {},
          onAddToMenu
        },
        day,
        meal
      );
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  return {
    selectedDay,
    setSelectedDay,
    sidebarOpen,
    setSidebarOpen,
    selectedMealInfo,
    setSelectedMealInfo,
    viewingRecipe,
    setViewingRecipe,
    currentMenuId,
    setCurrentMenuId,
    history,
    setHistory,
    activeMenu,
    setActiveMenu,
    handleMealClick,
    handleRecipeSelect,
    handleRemoveMealClick
  };
}