import { useState, useEffect, useCallback, useRef } from 'react';
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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

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

      // 5. Obtener estado de los items usando el menu_id
      const menuId = menuItems[0]?.menu_id;
      if (!menuId) {
        console.warn('No menu ID found, using recipe list without states');
        setShoppingList(newShoppingList);
        return;
      }

      const { data: checkedItems } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('menu_id', menuId);

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
  }, [userId, menuItems]);

  // Separar la suscripción en su propio efecto
  useEffect(() => {
    if (!userId || !isHousehold || !menuItems[0]?.linked_household_id) return;

    // Limpiar la suscripción anterior si existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Crear nuevo canal
    const householdId = menuItems[0].linked_household_id;
    const channel = supabase
      .channel(`shopping_list_${householdId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items',
          filter: `linked_household_id=eq.${householdId}`
        },
        (payload) => {
          // Recargar la lista cuando haya cambios
          generateList();
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, isHousehold, menuItems]);

  // Simplificar a un solo efecto para generar la lista
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

      const menuId = menuItems[0]?.menu_id;
      if (!menuId) {
        console.error('No menu ID found');
        return;
      }

      const newChecked = !item.checked;
      const daysArray = item.days ? `{${item.days.join(',')}}` : null;

      // Primero intentamos encontrar el item existente
      const { data: existingItem } = await supabase
        .from('shopping_list_items')
        .select('id')
        .eq('menu_id', menuId)
        .eq('item_name', name)
        .single();

      const itemData = {
        menu_id: menuId,
        item_name: name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        checked: newChecked,
        days: daysArray,
        updated_at: new Date().toISOString(),
        user_id: user.id
      };

      let error;
      if (existingItem) {
        // Si existe, actualizamos
        ({ error } = await supabase
          .from('shopping_list_items')
          .update(itemData)
          .eq('id', existingItem.id));
      } else {
        // Si no existe, insertamos
        ({ error } = await supabase
          .from('shopping_list_items')
          .insert(itemData));
      }

      if (error) {
        console.error('Error updating shopping list item:', error);
        return;
      }

      // Actualizar estado local inmediatamente
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
      const menuId = menuItems[0]?.menu_id;
      if (!menuId) {
        console.error('No menu ID found');
        return;
      }

      await supabase
        .from('shopping_list_items')
        .update({ checked: false })
        .eq('menu_id', menuId);

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