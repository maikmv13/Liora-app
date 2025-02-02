import React, { useState, useEffect } from 'react';
import { MenuItem, Recipe, MealType } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { TodayCard } from './TodayCard';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { MenuHistory } from './MenuHistory';
import { useMenuActions } from '../../hooks/useMenuActions';
import { useRecipes } from '../../hooks/useRecipes';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { supabase } from '../../lib/supabase';
import { weekDays } from './utils';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { MenuSkeleton } from './MenuSkeleton';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { MenuErrorNotification } from './MenuErrorNotification';
import type { Recipe as DBRecipe } from '../../types/recipe';
import { RecipeList } from '../RecipeList';
import { ChefHat } from 'lucide-react';

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
  const [menuError, setMenuError] = useState<string | null>(null);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);

  const { id, isHousehold, profile } = useActiveProfile();
  const { menuItems: menu, loading: menuLoading } = useActiveMenu(id, isHousehold);
  const { recipes, loading, error } = useRecipes();

  // Handle menu updates
  const handleAddToMenu = async (recipe: Recipe | null, day: string, meal: MealType) => {
    try {
      if (!id) {
        console.error('No hay un usuario autenticado');
        return;
      }

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

      // Obtener el menú activo usando el ID correcto
      const { data: activeMenu } = await supabase
        .from('weekly_menus')
        .select('id')
        .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? profile?.linked_household_id : id)
        .eq('status', 'active')
        .single();

      if (!activeMenu) {
        throw new Error('No hay un menú activo');
      }

      // Actualizar el menú con el ID correcto
      const { error: updateError } = await supabase
        .from('weekly_menus')
        .update({ [fieldName]: recipe?.id || null })
        .eq('id', activeMenu.id);

      if (updateError) throw updateError;

      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
    }
  };

  const { 
    isGenerating, 
    lastGenerated, 
    handleGenerateMenu, 
    handleExport 
  } = useMenuActions(
    id,
    isHousehold,
    handleAddToMenu,
    (menuId: string | null) => {
      if (menuId) {
        window.location.reload();
      }
    }
  );

  const handleGenerateMenuClick = async () => {
    try {
      setIsGeneratingMenu(true);
      await handleGenerateMenu(recipes as unknown as Recipe[]);
    } catch (error) {
      console.error('Error al generar menú:', error);
      let errorMessage = 'No se pudo generar el menú.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMenuError(errorMessage);
      setIsGeneratingMenu(false);
    }
  };

  const handleRestoreMenu = async (menuId: string) => {
    try {
      if (id) {
        // Archivar el menú activo actual
        await supabase
          .from('weekly_menus')
          .update({ status: 'archived' })
          .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? profile?.linked_household_id : id)
          .eq('status', 'active');
      }

      // Restaurar el menú seleccionado
      await supabase
        .from('weekly_menus')
        .update({ status: 'active' })
        .eq('id', menuId);

      setShowHistory(false);
      window.location.reload();
    } catch (error) {
      console.error('Error restoring menu:', error);
      setMenuError('Error al restaurar el menú');
    }
  };

  // Handle meal selection
  const handleMealClick = (day: string, meal: MealType) => {
    setSelectedMealInfo({ day, meal });
    setShowRecipeSelector(true);
  };

  // Handle recipe selection
  const handleRecipeSelect = async (recipe: Recipe) => {
    if (selectedMealInfo) {
      try {
        await handleAddToMenu(recipe, selectedMealInfo.day, selectedMealInfo.meal);
        setShowRecipeSelector(false);
        setSelectedMealInfo(null);
      } catch (error) {
        console.error('Error selecting recipe:', error);
      }
    }
  };

  const renderRecipeSelector = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <ChefHat size={32} className="mx-auto mb-4 text-rose-500 animate-bounce" />
            <p className="text-gray-600">Cargando recetas...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <div className="bg-red-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600">Error al cargar las recetas: {error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <RecipeList
        recipes={recipes}
        onRecipeSelect={handleRecipeSelect}
        favorites={favorites.map(f => ({ recipe_id: f }))}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  };

  // Loading state
  if (isGeneratingMenu || menuLoading) {
    return <MenuSkeleton />;
  }

  return (
    <>
      {menuError && (
        <MenuErrorNotification
          message={menuError}
          onClose={() => setMenuError(null)}
        />
      )}

      {/* Recipe Selector Sidebar */}
      {showRecipeSelector && (
        <RecipeSelectorSidebar onClose={() => setShowRecipeSelector(false)}>
          {renderRecipeSelector()}
        </RecipeSelectorSidebar>
      )}

      {/* Contenedor principal */}
      <div>
        {/* Main content */}
        <div className="relative mb-6">
          {menuLoading ? (
            <div className="mt-4 md:mt-6">
              <MenuSkeleton />
            </div>
          ) : (
            <>
              {/* Today's Menu */}
              <div className="mt-4 md:mt-6">
                <TodayCard
                  menuItems={menu}
                  onViewRecipe={setSelectedRecipe}
                  activeMenu={null}
                  onOpenOnboarding={handleGenerateMenuClick}
                />
              </div>

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
                    selectedDay={selectedDay as 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'}
                    weekDays={weekDays}
                    weeklyMenu={menu}
                    onDayChange={setSelectedDay}
                    onMealClick={handleMealClick}
                    onRemoveMeal={(day, meal) => handleAddToMenu(null, day, meal)}
                    onViewRecipe={setSelectedRecipe}
                    onAddToMenu={handleAddToMenu}
                    activeMenu={null}
                    onGenerateMenu={handleGenerateMenuClick}
                    onExport={() => handleExport(menu)}
                    onToggleHistory={() => setShowHistory(!showHistory)}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Menu History */}
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