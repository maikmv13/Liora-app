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
        // Obtener recetas con ingredientes
        const menuItemsWithIngredients = await Promise.all(
          menuItems.map(async (item) => {
            if (!item.recipe.recipe_ingredients || item.recipe.recipe_ingredients.length === 0) {
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

        // Generar lista de compra
        const newShoppingList = generateShoppingList(menuItemsWithIngredients);
        
        // Obtener estado de los items
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: checkedItems } = await supabase
            .from('shopping_list_items')
            .select('*')
            .eq('user_id', user.id);

          if (checkedItems) {
            // Actualizar la lista con los estados guardados
            const updatedList = newShoppingList.map(item => {
              const checkedItem = checkedItems.find(ci => ci.item_name === item.name);
              return {
                ...item,
                checked: checkedItem?.checked || false
              };
            });
            setShoppingList(updatedList);
          } else {
            setShoppingList(newShoppingList);
          }
        }
      } else {
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
      const item = shoppingList.find(i => i.name === name);
      if (!item) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newChecked = !item.checked;

      // Actualizar en base de datos
      await supabase
        .from('shopping_list_items')
        .upsert({
          user_id: user.id,
          item_name: name,
          checked: newChecked,
          days: item.days,
          updated_at: new Date().toISOString()
        });

      // Actualizar estado local
      setShoppingList(prev => prev.map(i => {
        if (i.name === name) {
          return { ...i, checked: newChecked };
        }
        return i;
      }));
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const refreshList = async () => {
    setLoading(true);
    try {
      await refetchRecipes();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Limpiar estados
        await supabase
          .from('shopping_list_items')
          .update({ checked: false })
          .eq('user_id', user.id);
      }

      await generateList();
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