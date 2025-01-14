import React, { useEffect } from 'react';
import { MenuItem, Recipe, MealType } from '../../types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { TodayCard } from './TodayCard';
import { RecipeSelectorSidebar } from './RecipeSelectorSidebar';
import { RecipeModal } from '../RecipeList/RecipeModal';
import { MenuHistory } from './MenuHistory';
import { weekDays } from './utils';
import { Calendar, Wand2, Share2, Loader2 } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';
import { mapRecipeToCardProps } from '../RecipeList/RecipeCard';
import { getActiveMenu, getMenuHistory } from '../../services/weeklyMenu';
import { useMenuState } from './hooks/useMenuState';
import { useMenuActions } from './hooks/useMenuActions';

interface WeeklyMenu2Props {
  readonly weeklyMenu: MenuItem[];
  readonly onRecipeSelect: (recipe: Recipe) => void;
  readonly onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void;
  readonly forUserId?: string;
}

export function WeeklyMenu2({ weeklyMenu, onRecipeSelect, onAddToMenu, forUserId }: WeeklyMenu2Props) {
  const { recipes, loading } = useRecipes();
  const {
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
  } = useMenuState(forUserId, onAddToMenu);

  const {
    isGenerating,
    lastGenerated,
    handleGenerateMenu,
    handleExport
  } = useMenuActions(forUserId, onAddToMenu, setCurrentMenuId, setActiveMenu, setHistory);

  // Get current day
  const today = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
  const todayItems = weeklyMenu.filter(item => 
    item.day.toLowerCase() === today.toLowerCase()
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const activeMenuData = await getActiveMenu(forUserId);
        if (activeMenuData) {
          setCurrentMenuId(activeMenuData.id);
          setActiveMenu(activeMenuData);
        }

        const historyData = await getMenuHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [forUserId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center">
            <Calendar size={24} className="text-rose-500 md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Menú Semanal</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              📅 Planifica tus comidas para la semana
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => handleGenerateMenu(recipes)}
            disabled={isGenerating || loading}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-colors ${
              isGenerating || loading
                ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500 text-white hover:from-orange-500 hover:via-pink-600 hover:to-rose-600'
            }`}
          >
            {isGenerating || loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Wand2 size={20} />
            )}
            <span>{isGenerating || loading ? 'Generando...' : 'Generar Menú'}</span>
          </button>
          <button 
            onClick={() => handleExport(weeklyMenu)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm text-rose-500 rounded-xl hover:bg-white/90 transition-colors border border-rose-100 shadow-sm"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {lastGenerated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-rose-50/50 px-3 py-2 rounded-lg">
          <Calendar size={16} className="text-rose-400" />
          <span>Último menú generado: {new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(lastGenerated))}</span>
        </div>
      )}

      <TodayCard 
        menuItems={todayItems}
        onViewRecipe={setViewingRecipe}
        activeMenu={activeMenu}
      />

      <div className="hidden md:block">
        <DesktopView
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMealClick}
          onViewRecipe={setViewingRecipe}
          onAddToMenu={onAddToMenu}
          activeMenu={activeMenu}
        />
      </div>
      
      <div className="md:hidden">
        <MobileView
          selectedDay={selectedDay}
          weekDays={weekDays}
          weeklyMenu={weeklyMenu}
          onDayChange={setSelectedDay}
          onMealClick={handleMealClick}
          onRemoveMeal={handleRemoveMealClick}
          onViewRecipe={setViewingRecipe}
          onAddToMenu={onAddToMenu}
          activeMenu={activeMenu}
        />
      </div>

      <MenuHistory 
        onRestore={async (menuItems) => {
          if (currentMenuId) {
            await archiveMenu(currentMenuId);
          }
          menuItems.forEach(item => {
            onAddToMenu(item.recipe, item.day, item.meal);
          });
        }}
        history={history}
        onHistoryChange={setHistory}
        onMenuArchived={(menu) => setHistory(prev => [menu, ...prev])}
      />

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
          recipe={mapRecipeToCardProps(viewingRecipe.recipe)}
          onClose={() => setViewingRecipe(null)}
          onAddToMenu={() => {}}
        />
      )}
    </div>
  );
}