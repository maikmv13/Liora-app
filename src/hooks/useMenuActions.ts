import { useState } from 'react';
import { Recipe, MenuItem, MealType } from '../types';
import { supabase } from '../lib/supabase';
import { generateCompleteMenu } from '../services/menuGenerator';
import { archiveMenu, createWeeklyMenu } from '../services/weeklyMenu';
import { retryOperation } from '../lib/supabase';

export function useMenuActions(
  userId: string | undefined,
  isHousehold: boolean,
  onAddToMenu: (recipe: Recipe | null, day: string, meal: MealType) => void,
  setCurrentMenuId: (id: string | null) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(
    localStorage.getItem('lastMenuGenerated')
  );

  const handleGenerateMenu = async (recipes: Recipe[]) => {
    if (isGenerating || !userId) {
      console.log('Cannot generate menu:', { isGenerating, userId });
      return;
    }
    
    try {
      setIsGenerating(true);

      // Verificar que hay suficientes recetas favoritas
      const { data: favorites } = await supabase
        .from('favorites')
        .select('recipe_id, recipes!favorites_recipe_id_fkey (meal_type)')
        .eq(isHousehold ? 'linked_household_id' : 'user_id', userId);

      if (!favorites || favorites.length === 0) {
        throw new Error('Necesitas marcar algunas recetas como favoritas antes de generar un menú.');
      }

      // Verificar que hay suficientes recetas por tipo
      const recipesByType = favorites.reduce<Record<string, number>>((acc, fav) => {
        const mealType = fav.recipes?.meal_type;
        if (mealType) {
          acc[mealType] = (acc[mealType] || 0) + 1;
        }
        return acc;
      }, {});

      const requiredPerType = 2;
      const missingTypes = [];

      for (const type of ['desayuno', 'comida', 'snack', 'cena']) {
        if (!recipesByType[type] || recipesByType[type] < requiredPerType) {
          missingTypes.push(type);
        }
      }

      if (missingTypes.length > 0) {
        throw new Error(
          `Para generar un menú más variado y nutritivo, necesitas al menos ${requiredPerType} recetas favoritas de cada tipo. Te faltan recetas de: ${missingTypes.join(', ')}.`
        );
      }

      // Get user's profile to check household
      const { data: profile } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', userId)
        .single();

      const householdId = isHousehold ? profile?.linked_household_id : null;

      // Reset shopping list
      await supabase
        .from('shopping_list_items')
        .delete()
        .eq(isHousehold ? 'linked_household_id' : 'user_id', householdId || userId);

      // Archive current menu if exists
      const { data: currentMenu } = await supabase
        .from('weekly_menus')
        .select('id')
        .eq(isHousehold ? 'linked_household_id' : 'user_id', householdId || userId)
        .eq('status', 'active')
        .maybeSingle();

      if (currentMenu) {
        await archiveMenu(currentMenu.id);
      }

      // Generate new menu
      const newMenu = await generateCompleteMenu(recipes, userId, isHousehold);
      
      // Create new menu with correct ownership
      const savedMenu = await createWeeklyMenu(
        newMenu, 
        userId,
        isHousehold,
        householdId
      );
      
      setCurrentMenuId(savedMenu.id);

      // Update UI with new menu items
      newMenu.forEach(menuItem => {
        onAddToMenu(menuItem.recipe as Recipe, menuItem.day, menuItem.meal);
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