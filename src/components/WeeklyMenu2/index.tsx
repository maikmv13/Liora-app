import React, { useState, useEffect } from 'react';
import { MenuItem, Recipe, MealType } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { TodayCard } from './TodayCard';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { Header } from './Header';
import { MenuHistory } from './MenuHistory';
import { OnboardingWizard } from './OnboardingWizard';
import { useMenuActions } from '../../hooks/useMenuActions';
import { useRecipes } from '../../hooks/useRecipes';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { supabase } from '../../lib/supabase';
import { weekDays } from './utils';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';

export function WeeklyMenu2() {
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');
  const [showHistory, setShowHistory] = useState(false);
  const [menuHistory, setMenuHistory] = useState<ExtendedWeeklyMenuDB[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<MenuItem | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{
    day: string;
    meal: MealType;
  } | null>(null);

  // Get current user
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  // Get active menu and recipes
  const { menuItems: menu, loading: menuLoading, error, activeMenuId } = useActiveMenu(userId || undefined);
  const { recipes } = useRecipes();

  // Handle menu updates
  const handleAddToMenu = async (recipe: Recipe | null, day: string, meal: MealType) => {
    try {
      if (!activeMenuId) {
        console.error('No hay un menú activo');
        return;
      }

      console.log('Actualizando menú:', {
        menuId: activeMenuId,
        day,
        meal,
        recipeId: recipe?.id
      });

      const dayKey = Object.entries({
        'Lunes': 'monday',
        'Martes': 'tuesday',
        'Miércoles': 'wednesday',
        'Jueves': 'thursday',
        'Viernes': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
      }).find(([key]) => key === day)?.[1];

      const mealKey = {
        'desayuno': 'breakfast',
        'comida': 'lunch',
        'snack': 'snack',
        'cena': 'dinner'
      }[meal];

      if (!dayKey || !mealKey) {
        throw new Error('Invalid day or meal type');
      }

      const fieldName = `${dayKey}_${mealKey}_id`;

      const { error: updateError } = await supabase
        .from('weekly_menus')
        .update({ [fieldName]: recipe?.id || null })
        .eq('id', activeMenuId);

      if (updateError) throw updateError;

      // Force page reload to update menu
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
    }
  };

  // Menu actions (generate, export, etc.)
  const { 
    isGenerating, 
    lastGenerated, 
    showOnboarding,
    setShowOnboarding,
    handleGenerateMenu, 
    handleExport 
  } = useMenuActions(
    userId || undefined,
    handleAddToMenu,
    (menuId: string | null) => {
      if (menuId) {
        window.location.reload();
      }
    }
  );

  // Load menu history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data: history, error } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('status', 'archived')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMenuHistory(history || []);
      } catch (error) {
        console.error('Error loading menu history:', error);
      }
    };

    if (showHistory) {
      loadHistory();
    }
  }, [showHistory]);

  // Restore menu from history
  const handleRestoreMenu = async (menuId: string) => {
    try {
      // Archive current active menu
      if (activeMenuId) {
        await supabase
          .from('weekly_menus')
          .update({ status: 'archived' })
          .eq('id', activeMenuId);
      }

      // Restore selected menu
      await supabase
        .from('weekly_menus')
        .update({ status: 'active' })
        .eq('id', menuId);

      setShowHistory(false);
      window.location.reload();
    } catch (error) {
      console.error('Error restoring menu:', error);
    }
  };

  // Handle meal selection
  const handleMealClick = (day: string, meal: MealType) => {
    console.log('Seleccionando comida:', { day, meal });
    setSelectedMealInfo({ day, meal });
    setShowRecipeSelector(true);
  };

  // Handle recipe selection
  const handleRecipeSelect = async (recipe: Recipe) => {
    if (selectedMealInfo) {
      console.log('Seleccionando receta:', {
        recipe,
        day: selectedMealInfo.day,
        meal: selectedMealInfo.meal
      });

      try {
        await handleAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
        setShowRecipeSelector(false);
        setSelectedMealInfo(null);
      } catch (error) {
        console.error('Error selecting recipe:', error);
      }
    }
  };

  // Si está cargando, mostramos el loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Si no hay usuario o showOnboarding es true, mostramos el onboarding
  if (!userId || showOnboarding) {
    return (
      <OnboardingWizard
        isOpen={true}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
        onGenerateMenu={() => handleGenerateMenu(recipes)}
      />
    );
  }

  // Si hay error en la carga del menú
  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-200 p-6">
        <p className="text-red-600 text-center">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 mx-auto block"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Recipe Selector Sidebar */}
      <RecipeSelectorSidebar
        isOpen={showRecipeSelector}
        onClose={() => {
          setShowRecipeSelector(false);
          setSelectedMealInfo(null);
        }}
        onSelectRecipe={handleRecipeSelect}
        selectedDay={selectedMealInfo?.day || ''}
        selectedMeal={selectedMealInfo?.meal || 'comida'}
      />

      {/* Contenedor principal */}
      <div>
        {/* Header */}
        <Header
          className="mb-6"
          onGenerateMenu={() => handleGenerateMenu(recipes)}
          onExport={() => handleExport(menu)}
          onToggleHistory={() => setShowHistory(!showHistory)}
          isGenerating={isGenerating}
          lastGenerated={lastGenerated}
        />

        {/* Main content */}
        <div className="relative mb-6">
          {menuLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <>
              {/* Today's Menu */}
              <TodayCard
                menuItems={menu}
                onViewRecipe={setSelectedRecipe}
                activeMenu={null}
              />

              {/* Weekly Menu View */}
              <div className="mt-6">
                <div className="hidden md:block">
                  <DesktopView
                    weekDays={weekDays}
                    weeklyMenu={menu}
                    onMealClick={handleMealClick}
                    onRemoveMeal={(day, meal) => handleAddToMenu(null, day, meal)}
                    onViewRecipe={setSelectedRecipe}
                    onAddToMenu={handleAddToMenu}
                    activeMenu={null}
                  />
                </div>
                <div className="md:hidden">
                  <MobileView
                    selectedDay={selectedDay as 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'  }
                    weekDays={weekDays}
                    weeklyMenu={menu}
                    onDayChange={setSelectedDay}
                    onMealClick={handleMealClick}
                    onRemoveMeal={(day, meal) => handleAddToMenu(null, day, meal)}
                    onViewRecipe={setSelectedRecipe}
                    onAddToMenu={handleAddToMenu}
                    activeMenu={null}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Menu History y Onboarding Wizard */}
        {showHistory && (
          <div className="mb-6">
            <MenuHistory
              history={menuHistory}
              onRestore={handleRestoreMenu}
              onHistoryChange={setMenuHistory}
              onMenuArchived={() => {}}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default WeeklyMenu2;