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
  const { recipes } = useRecipes();

  // Memoizar la función de generación de lista
  const generateList = useCallback(async () => {
    if (!userId || !menuItems.length) {
      setShoppingList([]);
      setLoading(false);
      return;
    }

    try {
      // 1. Obtener todas las recetas con ingredientes en una sola consulta
      const recipeIds = [...new Set(menuItems.map(item => item.recipe.id))];
      const { data: recipesWithIngredients } = await supabase
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
        .in('id', recipeIds);

      if (!recipesWithIngredients) {
        setShoppingList([]);
        setLoading(false);
        return;
      }

      // 2. Crear un mapa de recetas para acceso rápido
      const recipeMap = new Map(
        recipesWithIngredients.map(recipe => [recipe.id, recipe])
      );

      // 3. Procesar menú con recetas del mapa
      const menuItemsWithIngredients = menuItems.map(item => ({
        ...item,
        recipe: recipeMap.get(item.recipe.id) || item.recipe
      }));

      // 4. Generar lista de compra
      const newShoppingList = generateShoppingList(menuItemsWithIngredients);

      // 5. Obtener estado de los items en una sola consulta
      const { data: checkedItems } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('user_id', userId);

      // 6. Crear mapa de items marcados para acceso rápido
      const checkedItemsMap = new Map(
        checkedItems?.map(item => [item.item_name.toLowerCase(), item]) || []
      );

      // 7. Actualizar lista con estados
      const finalList = newShoppingList.map(item => ({
        ...item,
        checked: checkedItemsMap.get(item.name.toLowerCase())?.checked || false,
        purchasedQuantity: checkedItemsMap.get(item.name.toLowerCase())?.quantity
      }));

      setShoppingList(finalList);
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setShoppingList([]);
    } finally {
      setLoading(false);
    }
  }, [userId, menuItems, isHousehold]);

  // Reducir las llamadas al efecto
  useEffect(() => {
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
      const daysArray = item.days ? `{${item.days.join(',')}}` : null;
      const menuId = menuItems[0]?.menu_id;

      // Preparar los datos base
      const itemData = {
        user_id: user.id,
        item_name: name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        checked: newChecked,
        days: daysArray,
        updated_at: new Date().toISOString()
      };

      // Añadir menu_id solo si existe
      if (menuId) {
        Object.assign(itemData, { menu_id: menuId });
      }

      const { error } = await supabase
        .from('shopping_list_items')
        .upsert(itemData);

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
        let query = supabase
          .from('shopping_list_items')
          .update({ checked: false })
          .eq('user_id', user.id);

        const menuId = menuItems[0]?.menu_id;
        if (menuId) {
          query = query.eq('menu_id', menuId);
        }

        await query;
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