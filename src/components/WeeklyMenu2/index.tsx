import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, Recipe, MealType } from '../../types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { TodayCard } from './TodayCard';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { RecipeModal } from '../RecipeList/RecipeModal';
import { MenuHistory } from './MenuHistory';
import { weekDays } from './utils';
import { useRecipes } from '../../hooks/useRecipes';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { useMenuActions } from './hooks/useMenuActions';
import { updateMenuRecipe, restoreMenu, getMenuHistory } from '../../services/weeklyMenu';
import { Header } from './Header';
import { MenuSkeleton } from './MenuSkeleton';
import type { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { supabase } from '../../lib/supabase';

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

  // Obtener el usuario actual
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Obtener el menú activo y las recetas
  const { menuItems: menu, loading, error, activeMenuId } = useActiveMenu(userId || undefined);
  const { recipes } = useRecipes();

  // Manejar actualizaciones del menú
  const handleAddToMenu = useCallback(async (recipe: Recipe | null, day: string, meal: MealType) => {
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

      await updateMenuRecipe(activeMenuId, day, meal, recipe?.id || null);

      // Forzar recarga de la página para actualizar el menú
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
    }
  }, [activeMenuId]);

  // Acciones del menú (generar, exportar, etc.)
  const { isGenerating, lastGenerated, handleGenerateMenu, handleExport } = useMenuActions(
    userId || undefined,
    handleAddToMenu,
    (menuId: string | null) => {
      if (menuId) {
        window.location.reload();
      }
    }
  );

  // Cargar historial de menús
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getMenuHistory();
        setMenuHistory(history);
      } catch (error) {
        console.error('Error loading menu history:', error);
      }
    };

    if (showHistory) {
      loadHistory();
    }
  }, [showHistory]);

  // Restaurar un menú del historial
  const handleRestoreMenu = async (menuId: string) => {
    try {
      await restoreMenu(menuId);
      setShowHistory(false);
      window.location.reload();
    } catch (error) {
      console.error('Error restoring menu:', error);
    }
  };

  // Manejar selección de comidas
  const handleMealClick = (day: string, meal: MealType) => {
    console.log('Seleccionando comida:', { day, meal });
    setSelectedMealInfo({ day, meal });
    setShowRecipeSelector(true);
  };

  // Manejar selección de recetas
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

  return (
    <div className="space-y-6">
      {/* Header - Siempre visible */}
      <Header
        onGenerateMenu={() => handleGenerateMenu(recipes)}
        onExport={() => handleExport(menu)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        isGenerating={isGenerating}
        lastGenerated={lastGenerated}
      />

      {/* Contenido principal con skeleton loading */}
      <div className="relative">
        {loading ? (
          <MenuSkeleton />
        ) : error ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-200 p-6">
            <p className="text-red-600 text-center">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 mx-auto block"
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
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
                  selectedDay={selectedDay}
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

      {/* Modales y sidebars - Siempre disponibles */}
      {showRecipeSelector && selectedMealInfo && (
        <RecipeSelectorSidebar
          isOpen={showRecipeSelector}
          onClose={() => setShowRecipeSelector(false)}
          onSelectRecipe={handleRecipeSelect}
          selectedDay={selectedMealInfo.day}
          selectedMeal={selectedMealInfo.meal}
        />
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe.recipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}

      {showHistory && (
        <MenuHistory
          history={menuHistory}
          onRestore={handleRestoreMenu}
          onHistoryChange={setMenuHistory}
          onMenuArchived={() => {}}
        />
      )}
    </div>
  );
}

export default WeeklyMenu2;