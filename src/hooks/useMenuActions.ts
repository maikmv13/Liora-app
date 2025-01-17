import { useState } from 'react';
import { Recipe, MenuItem, MealType } from '../types';
import { supabase } from '../lib/supabase';
import { generateCompleteMenu } from '../services/menuGenerator';
import { archiveMenu, createWeeklyMenu } from '../services/weeklyMenu';

export function useMenuActions(
  forUserId: string | undefined,
  onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void,
  setCurrentMenuId: (id: string | null) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );
  const [showOnboarding, setShowOnboarding] = useState(false);

  const checkFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get favorites count by meal type
      const { data: favs, error } = await supabase
        .from('favorites')
        .select(`
          recipe_id,
          recipes!favorites_recipe_id_fkey (
            meal_type
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Count favorites by meal type
      const stats = favs?.reduce((acc, fav) => {
        const mealType = fav.recipes?.meal_type as MealType;
        if (mealType) {
          acc[mealType] = (acc[mealType] || 0) + 1;
        }
        return acc;
      }, {} as Record<MealType, number>);

      // Check if we have at least 2 recipes per meal type
      return Object.values(stats || {}).every(count => count >= 2);
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  };

  const handleGenerateMenu = async (recipes: Recipe[]) => {
    if (isGenerating) return;
    
    try {
      // Check if we have enough favorites first
      const hasEnoughFavorites = await checkFavorites();
      if (!hasEnoughFavorites) {
        setShowOnboarding(true);
        return;
      }

      setIsGenerating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get favorite recipes
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          recipes!favorites_recipe_id_fkey (
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
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;
      
      const favoriteRecipes = favorites?.map(f => f.recipes as Recipe) || [];
      if (favoriteRecipes.length === 0) {
        throw new Error('No tienes recetas favoritas. Añade algunas antes de generar el menú.');
      }

      // Reset shopping list
      await supabase
        .from('shopping_list_items')
        .delete()
        .eq('user_id', user.id);

      // Archive current menu if exists
      const { data: currentMenu } = await supabase
        .from('weekly_menus')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (currentMenu) {
        await archiveMenu(currentMenu.id);
      }

      // Generate new menu using only favorite recipes
      const newMenu = await generateCompleteMenu(favoriteRecipes);
      const savedMenu = await createWeeklyMenu(newMenu, user.id);
      
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
    showOnboarding,
    setShowOnboarding,
    handleGenerateMenu,
    handleExport
  };
}