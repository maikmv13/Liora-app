import { MealType, MenuItem, Recipe } from '../../types';
import { ExtendedWeeklyMenuDB } from '../../services/weeklyMenu';
import { 
  archiveMenu, 
  createWeeklyMenu, 
  getActiveMenu, 
  getMenuHistory,
  updateMenuRecipe,
  removeMenuRecipe
} from '../../services/weeklyMenu';
import { generateCompleteMenu } from '../../services/menuGenerator';

interface MenuHandlerContext {
  currentMenuId: string | null;
  forUserId?: string;
  setHistory: (history: ExtendedWeeklyMenuDB[]) => void;
  setActiveMenu: (menu: ExtendedWeeklyMenuDB | null) => void;
  setCurrentMenuId: (id: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void;
}

/**
 * Maneja la actualización de una receta en el menú
 */
export const handleUpdateMenuRecipe = async (
  context: MenuHandlerContext,
  day: string,
  meal: MealType,
  recipe: Recipe | null
) => {
  try {
    if (!context.currentMenuId) {
      throw new Error('No hay un menú activo');
    }

    if (recipe) {
      // Actualizar en la base de datos sin archivar el menú actual
      await updateMenuRecipe(context.currentMenuId, day, meal, recipe.id);
    } else {
      // Eliminar de la base de datos sin archivar el menú actual
      await removeMenuRecipe(context.currentMenuId, day, meal);
    }

    // Actualizar la UI
    context.onAddToMenu(recipe, day, meal);

    // Recargar el menú activo para mantener todo sincronizado
    const updatedMenu = await getActiveMenu(context.forUserId);
    if (updatedMenu) {
      context.setActiveMenu(updatedMenu);
    }

  } catch (error) {
    console.error('Error al actualizar la receta en el menú:', error);
    throw error;
  }
};

/**
 * Maneja la eliminación de una receta del menú
 */
export const handleRemoveMeal = async (
  context: MenuHandlerContext,
  day: string,
  meal: MealType
) => {
  try {
    if (!context.currentMenuId) {
      throw new Error('No hay un menú activo');
    }

    // Eliminar de la base de datos sin archivar el menú actual
    await removeMenuRecipe(context.currentMenuId, day, meal);

    // Actualizar la UI
    context.onAddToMenu(null, day, meal);

    // Recargar el menú activo
    const updatedMenu = await getActiveMenu(context.forUserId);
    if (updatedMenu) {
      context.setActiveMenu(updatedMenu);
    }

  } catch (error) {
    console.error('Error al eliminar la receta del menú:', error);
    throw error;
  }
};