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

      await updateMenuRecipe(activeMenuId, day, meal, recipe?.id || null);
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
    }
  }, [activeMenuId]);

  // Acciones del menú (generar, exportar, etc.)
  const { isGenerating, lastGenerated, handleGenerateMenu, handleExport } = useMenuActions(
    userId || undefined,
    handleAddToMenu,
    (menuId: string | null) => {
      // Este callback se llama cuando se genera un nuevo menú
      if (menuId) {
        // Recargar el menú activo
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
      // Recargar la página para mostrar el menú restaurado
      window.location.reload();
    } catch (error) {
      console.error('Error restoring menu:', error);
    }
  };

  // Manejar selección de comidas
  const handleMealClick = (day: string, meal: MealType) => {
    setSelectedMealInfo({ day, meal });
    setShowRecipeSelector(true);
  };

  // Manejar selección de recetas
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        onGenerateMenu={() => handleGenerateMenu(recipes)}
        onExport={() => handleExport(menu)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        isGenerating={isGenerating}
        lastGenerated={lastGenerated}
      />

      {/* Today's Menu */}
      <TodayCard
        menuItems={menu}
        onViewRecipe={setSelectedRecipe}
        activeMenu={null}
      />

      {/* Weekly Menu View */}
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

      {/* Recipe Selector Sidebar */}
      {showRecipeSelector && selectedMealInfo && (
        <RecipeSelectorSidebar
          isOpen={showRecipeSelector}
          onClose={() => setShowRecipeSelector(false)}
          onSelectRecipe={handleRecipeSelect}
          selectedDay={selectedMealInfo.day}
          selectedMeal={selectedMealInfo.meal}
        />
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe.recipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}

      {/* Menu History */}
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