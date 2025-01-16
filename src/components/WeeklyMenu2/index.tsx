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
import { useActiveMenu } from '../../hooks/useActiveMenu';

interface WeeklyMenu2Props {
  readonly weeklyMenu: MenuItem[];
  readonly onRecipeSelect: (recipe: Recipe) => void;
  readonly onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void;
  readonly forUserId?: string;
}

export const WeeklyMenu2 = () => {
  const { menu, error, loading } = useActiveMenu();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-red-600 text-center mb-4">
          {error}
        </p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No hay menú disponible en este momento</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <DesktopView menu={menu} />
      </div>
      <div className="md:hidden">
        <MobileView menu={menu} />
      </div>
    </>
  );
};

export default WeeklyMenu2;