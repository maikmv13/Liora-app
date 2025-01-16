import { useState } from 'react';
import { Recipe, MenuItem, MealType } from '../../../types';
import { ExtendedWeeklyMenuDB } from '../../../services/weeklyMenu';
import { 
  archiveMenu, 
  createWeeklyMenu, 
  getActiveMenu, 
  getMenuHistory 
} from '../../../services/weeklyMenu';
import { generateCompleteMenu } from '../../../services/menuGenerator';
import { supabase } from '../../../lib/supabase';

export function useMenuActions(
  forUserId: string | undefined,
  onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void,
  setCurrentMenuId: (id: string | null) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );

  const resetShoppingList = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting shopping list:', error);
    }
  };

  const getFavoriteRecipes = async (userId: string): Promise<Recipe[]> => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipe:recipes!favorites_recipe_id_fkey (
            id,
            name,
            category,
            meal_type,
            servings,
            calories,
            prep_time,
            side_dish,
            instructions,
            image_url,
            created_at,
            updated_at,
            recipe_ingredients (
              id,
              quantity,
              unit,
              ingredient_id,
              ingredients (
                id,
                name,
                category
              )
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data?.map(item => item.recipe as Recipe) || [];
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      return [];
    }
  };

  const handleGenerateMenu = async (recipes: Recipe[]) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get favorite recipes
      const favoriteRecipes = await getFavoriteRecipes(user.id);
      
      if (favoriteRecipes.length === 0) {
        throw new Error('No tienes recetas favoritas. Añade algunas antes de generar el menú.');
      }

      // Reset shopping list
      await resetShoppingList(user.id);

      // Archive current menu if exists
      const currentMenu = await getActiveMenu(forUserId);
      if (currentMenu) {
        await archiveMenu(currentMenu.id);
      }

      // Generate new menu using only favorite recipes
      const newMenu = await generateCompleteMenu(favoriteRecipes);
      const savedMenu = await createWeeklyMenu(newMenu, forUserId);
      
      setCurrentMenuId(savedMenu.id);

      newMenu.forEach(menuItem => {
        onAddToMenu(menuItem.recipe, menuItem.day, menuItem.meal);
      });

      const timestamp = new Date().toISOString();
      setLastGenerated(timestamp);
      localStorage.setItem('lastMenuGenerated', timestamp);

    } catch (error) {
      console.error('Error generating menu:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (weeklyMenu: MenuItem[]) => {
    const today = new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());

    const menuContent = `🍽️ *Menú Semanal de Favoritos*\n📅 Generado el ${today}\n\n` + 
      weeklyMenu.reduce((content, item) => {
        if (['comida', 'cena'].includes(item.meal)) {
          const icon = item.meal === 'comida' ? '🍳' : '🌙';
          const mealType = item.meal === 'comida' ? 'Comida' : 'Cena';
          return content + `*${item.day}* - ${icon} ${mealType}: ${item.recipe.name}\n`;
        }
        return content;
      }, '');

    const encodedMessage = encodeURIComponent(menuContent);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return {
    isGenerating,
    lastGenerated,
    handleGenerateMenu,
    handleExport
  };
}