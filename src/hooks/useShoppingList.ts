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
      // 1. Obtener el perfil y verificar si pertenece a un household
      const { data: profile } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', userId)
        .single();

      // 2. Obtener el menú activo
      let menuQuery = supabase
        .from('weekly_menus')
        .select('id, linked_household_id')
        .eq('status', 'active');

      // Si el usuario pertenece a un household, buscamos primero el menú del household
      if (profile?.linked_household_id) {
        const { data: householdMenu } = await menuQuery
          .eq('linked_household_id', profile.linked_household_id)
          .maybeSingle();

        if (householdMenu) {
          // Obtener items de la lista de compras del household
          const { data: checkedItems } = await supabase
            .from('shopping_list_items')
            .select('*')
            .eq('menu_id', householdMenu.id)
            .eq('linked_household_id', profile.linked_household_id);

          // 3. Obtener todas las recetas con ingredientes en una sola consulta
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

          // 4. Crear un mapa de recetas para acceso rápido
          const recipeMap = new Map(
            recipesWithIngredients.map(recipe => [recipe.id, recipe])
          );

          // 5. Procesar menú con recetas del mapa
          const menuItemsWithIngredients = menuItems.map(item => ({
            ...item,
            recipe: recipeMap.get(item.recipe.id) || item.recipe
          }));

          // 6. Generar lista de compra
          const newShoppingList = generateShoppingList(menuItemsWithIngredients);

          // 7. Actualizar lista con estados
          const finalList = newShoppingList.map(item => ({
            ...item,
            checked: checkedItems.some(i => i.item_name.toLowerCase() === item.name.toLowerCase()),
            purchasedQuantity: checkedItems.find(i => i.item_name.toLowerCase() === item.name.toLowerCase())?.quantity
          }));

          setShoppingList(finalList);
          return;
        }
      }

      // Si no hay menú de household o el usuario no pertenece a uno, buscamos el menú personal
      const { data: personalMenu } = await menuQuery
        .eq('user_id', userId)
        .maybeSingle();

      if (personalMenu) {
        // Obtener items de la lista de compras personal
        const { data: checkedItems } = await supabase
          .from('shopping_list_items')
          .select('*')
          .eq('menu_id', personalMenu.id)
          .eq('user_id', userId);

        // 3. Obtener todas las recetas con ingredientes en una sola consulta
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

        // 4. Crear un mapa de recetas para acceso rápido
        const recipeMap = new Map(
          recipesWithIngredients.map(recipe => [recipe.id, recipe])
        );

        // 5. Procesar menú con recetas del mapa
        const menuItemsWithIngredients = menuItems.map(item => ({
          ...item,
          recipe: recipeMap.get(item.recipe.id) || item.recipe
        }));

        // 6. Generar lista de compra
        const newShoppingList = generateShoppingList(menuItemsWithIngredients);

        // 7. Actualizar lista con estados
        const finalList = newShoppingList.map(item => ({
          ...item,
          checked: checkedItems.some(i => i.item_name.toLowerCase() === item.name.toLowerCase()),
          purchasedQuantity: checkedItems.find(i => i.item_name.toLowerCase() === item.name.toLowerCase())?.quantity
        }));

        setShoppingList(finalList);
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setShoppingList([]);
    } finally {
      setLoading(false);
    }
  }, [userId, menuItems]);

  // Modificar el efecto de suscripción
  useEffect(() => {
    if (!userId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const menuId = menuItems[0]?.menu_id;
    const householdId = menuItems[0]?.linked_household_id;
    
    if (!menuId && !householdId) return;

    const channel = supabase
      .channel(`shopping_list_${menuId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items',
          filter: isHousehold 
            ? `linked_household_id=eq.${householdId}` 
            : `user_id=eq.${userId}`
        },
        (payload) => {
          generateList();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, isHousehold, menuItems, generateList]);

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

      // Obtener el perfil y verificar household
      const { data: profile } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', user.id)
        .single();

      // Obtener el menú activo
      let menuQuery = supabase
        .from('weekly_menus')
        .select('id, linked_household_id')
        .eq('status', 'active');

      const { data: activeMenu } = profile?.linked_household_id
        ? await menuQuery
            .eq('linked_household_id', profile.linked_household_id)
            .maybeSingle()
        : await menuQuery
            .eq('user_id', user.id)
            .maybeSingle();

      if (!activeMenu?.id) {
        console.error('No menu ID found');
        return;
      }

      const newChecked = !item.checked;
      const daysArray = item.days ? `{${item.days.join(',')}}` : null;

      const itemData = {
        menu_id: activeMenu.id,
        item_name: name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        checked: newChecked,
        days: daysArray,
        updated_at: new Date().toISOString(),
        ...(profile?.linked_household_id 
          ? {
              user_id: null,
              linked_household_id: profile.linked_household_id
            }
          : {
              user_id: user.id,
              linked_household_id: null
            }
        )
      };

      // Buscar item existente
      const { data: existingItem } = await supabase
        .from('shopping_list_items')
        .select('id')
        .eq('menu_id', activeMenu.id)
        .eq('item_name', name)
        .eq(profile?.linked_household_id ? 'linked_household_id' : 'user_id',
            profile?.linked_household_id || user.id)
        .is('user_id', profile?.linked_household_id ? null : user.id)
        .single();

      let error;
      if (existingItem) {
        ({ error } = await supabase
          .from('shopping_list_items')
          .update(itemData)
          .eq('id', existingItem.id));
      } else {
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