import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem } from '../types';
import { generateShoppingList } from '../services/shoppingList';
import { useActiveMenu } from './useActiveMenu';
import { supabase } from '../lib/supabase';
import { useRecipes } from './useRecipes';

export function useShoppingList(userId?: string) {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { menuItems, loading: menuLoading } = useActiveMenu(userId);
  const { recipes, refetch: refetchRecipes } = useRecipes();

  const generateList = useCallback(async () => {
    try {
      if (menuItems.length > 0) {
        // Ensure all recipes have their ingredients loaded
        const menuItemsWithIngredients = await Promise.all(
          menuItems.map(async (item) => {
            if (!item.recipe.recipe_ingredients || item.recipe.recipe_ingredients.length === 0) {
              // Try to fetch recipe with ingredients
              const { data: recipeData, error } = await supabase
                .from('recipes')
                .select(`
                  *,
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
                `)
                .eq('id', item.recipe.id)
                .single();

              if (!error && recipeData) {
                return {
                  ...item,
                  recipe: recipeData
                };
              }
            }
            return item;
          })
        );

        console.log('Generating shopping list for menu items:', menuItemsWithIngredients);
        const newShoppingList = generateShoppingList(menuItemsWithIngredients);
        console.log('Generated shopping list:', newShoppingList);
        setShoppingList(newShoppingList);
      } else {
        console.log('No menu items, setting empty shopping list');
        setShoppingList([]);
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setShoppingList([]);
    } finally {
      setLoading(false);
    }
  }, [menuItems]);

  useEffect(() => {
    if (!menuLoading) {
      generateList();
    }
  }, [menuItems, menuLoading, generateList]);

  const toggleItem = async (name: string, day?: string) => {
    try {
      setShoppingList(prev => 
        prev.map(item => {
          if (item.name === name && (!day || item.days.includes(day))) {
            return { ...item, checked: !item.checked };
          }
          return item;
        })
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const item = shoppingList.find(i => i.name === name);
        if (item) {
          await supabase
            .from('shopping_list_items')
            .upsert({
              user_id: user.id,
              item_name: name,
              checked: !item.checked,
              updated_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const refreshList = async () => {
    setLoading(true);
    try {
      // Refetch recipes to ensure we have the latest data
      await refetchRecipes();
      
      // Force regenerate the shopping list
      await generateList();
      
      // Clear checked items
      setShoppingList(prev => prev.map(item => ({ ...item, checked: false })));
      
      // Update database if needed
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('shopping_list_items')
          .update({ checked: false })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error refreshing shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    shoppingList, 
    loading, 
    toggleItem,
    refreshList
  };
}