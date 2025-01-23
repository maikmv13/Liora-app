import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem } from '../types';
import { generateShoppingList } from '../services/shoppingList';
import { useActiveMenu } from './useActiveMenu';
import { supabase } from '../lib/supabase';
import { useRecipes } from './useRecipes';

export function useShoppingList(userId?: string, isHousehold = false) {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { menuItems, loading: menuLoading } = useActiveMenu(userId, isHousehold);
  const { recipes, refetch: refetchRecipes } = useRecipes();

  const generateList = useCallback(async () => {
    try {
      console.log('Starting generateList with:', { userId, isHousehold, menuItems });
      
      if (menuItems.length > 0) {
        // Obtener recetas con ingredientes
        const menuItemsWithIngredients = await Promise.all(
          menuItems.map(async (item) => {
            console.log('Processing menu item:', item);
            
            if (!item.recipe.recipe_ingredients || item.recipe.recipe_ingredients.length === 0) {
              console.log('Fetching recipe ingredients for:', item.recipe.id);
              
              const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select(`
                  id,
                  name,
                  servings,
                  meal_type,
                  category,
                  recipe_ingredients(
                    id,
                    quantity,
                    unit,
                    ingredients(
                      id,
                      name,
                      category
                    )
                  )
                `)
                .eq('id', item.recipe.id)
                .single();

              if (recipeError) {
                console.error('Error fetching recipe ingredients:', recipeError);
                return item;
              }

              if (recipeData) {
                console.log('Found recipe with ingredients:', recipeData);
                return {
                  ...item,
                  recipe: recipeData
                };
              }
            } else {
              console.log('Recipe already has ingredients:', item.recipe.recipe_ingredients);
            }
            return item;
          })
        );

        console.log('Menu items with ingredients:', menuItemsWithIngredients);

        // Generar lista de compra
        const newShoppingList = generateShoppingList(menuItemsWithIngredients);
        console.log('Generated shopping list:', newShoppingList);
        
        // Obtener estado de los items
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('Fetching checked items for user:', user.id);
          
          const { data: checkedItems, error: checkedError } = await supabase
            .from('shopping_list_items')
            .select(`
              id,
              user_id,
              menu_id,
              item_name,
              category,
              quantity,
              unit,
              checked,
              days,
              created_at,
              updated_at,
              linked_household_id
            `)
            .eq(isHousehold ? 'linked_household_id' : 'user_id', isHousehold ? userId : user.id);

          if (checkedError) {
            console.error('Error fetching checked items:', checkedError);
          }

          console.log('Found checked items:', checkedItems);

          if (checkedItems) {
            // Actualizar la lista con los estados guardados
            const updatedList = newShoppingList.map(item => {
              const checkedItem = checkedItems.find(ci => 
                ci.item_name.toLowerCase() === item.name.toLowerCase()
              );
              console.log('Mapping item:', { item, checkedItem });
              return {
                ...item,
                checked: checkedItem?.checked || false,
                purchasedQuantity: checkedItem?.quantity
              };
            });
            console.log('Final shopping list:', updatedList);
            setShoppingList(updatedList);
          } else {
            console.log('No checked items found, using new list:', newShoppingList);
            setShoppingList(newShoppingList);
          }
        }
      } else {
        console.log('No menu items found, setting empty shopping list');
        setShoppingList([]);
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setShoppingList([]);
    } finally {
      setLoading(false);
    }
  }, [menuItems, userId, isHousehold]);

  useEffect(() => {
    console.log('useEffect triggered:', { menuLoading, menuItems });
    if (!menuLoading) {
      generateList();
    }
  }, [menuItems, menuLoading, generateList]);

  const toggleItem = async (name: string, day?: string) => {
    try {
      const item = shoppingList.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (!item) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newChecked = !item.checked;

      // Formatear los días como array de PostgreSQL
      const daysArray = item.days ? `{${item.days.join(',')}}` : null;

      // Actualizar en base de datos
      const { error } = await supabase
        .from('shopping_list_items')
        .upsert({
          user_id: user.id,
          linked_household_id: isHousehold ? userId : null,
          menu_id: item.menu?.id,
          item_name: name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          checked: newChecked,
          days: daysArray, // Usar el array formateado
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating shopping list item:', error);
        return;
      }

      // Actualizar estado local
      setShoppingList(prev => prev.map(i => {
        if (i.name.toLowerCase() === name.toLowerCase()) {
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
          .eq(isHousehold ? 'linked_household_id' : 'user_id', userId);
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