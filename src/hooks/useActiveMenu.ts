import { useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem, Recipe } from '../types';
import { supabase } from '../lib/supabase';
import { useRecipes } from './useRecipes';
import { transformWeeklyMenuToMenuItems } from '../utils/menuTransforms';

export function useActiveMenu(userId: string | undefined, isHousehold: boolean) {
  const [state, setState] = useState({
    menuItems: [] as MenuItem[],
    loading: true,
    error: null as Error | null
  });
  const { recipes } = useRecipes();
  const mounted = useRef(true);
  const lastFetch = useRef<number>(0);
  const CACHE_DURATION = 60 * 1000; // 1 minuto de caché

  const fetchMenu = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastFetch.current && now - lastFetch.current < CACHE_DURATION) {
      return; // Usar caché si no ha pasado el tiempo mínimo
    }

    if (!userId || !recipes.length || !mounted.current) return;

    try {
      // 1. Obtener perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('linked_household_id')
        .eq('user_id', userId)
        .single();

      if (!mounted.current) return;

      // 2. Obtener menú activo
      const { data: menu, error: menuError } = await supabase
        .from('weekly_menus')
        .select(`
          id,
          status,
          created_at,
          monday_breakfast_id,
          monday_lunch_id,
          monday_dinner_id,
          monday_snack_id,
          tuesday_breakfast_id,
          tuesday_lunch_id,
          tuesday_dinner_id,
          tuesday_snack_id,
          wednesday_breakfast_id,
          wednesday_lunch_id,
          wednesday_dinner_id,
          wednesday_snack_id,
          thursday_breakfast_id,
          thursday_lunch_id,
          thursday_dinner_id,
          thursday_snack_id,
          friday_breakfast_id,
          friday_lunch_id,
          friday_dinner_id,
          friday_snack_id,
          saturday_breakfast_id,
          saturday_lunch_id,
          saturday_dinner_id,
          saturday_snack_id,
          sunday_breakfast_id,
          sunday_lunch_id,
          sunday_dinner_id,
          sunday_snack_id
        `)
        .eq('status', 'active')
        .eq(
          isHousehold ? 'linked_household_id' : 'user_id',
          isHousehold ? profile?.linked_household_id : userId
        )
        .maybeSingle();

      if (!mounted.current) return;

      if (menuError && menuError.code !== 'PGRST116') {
        throw menuError;
      }

      if (!menu) {
        setState(prev => ({ ...prev, menuItems: [], loading: false }));
        return;
      }

      // Transformar los datos del menú
      const transformedItems = transformWeeklyMenuToMenuItems(menu, recipes);

      if (mounted.current) {
        setState({
          menuItems: transformedItems,
          loading: false,
          error: null
        });
        lastFetch.current = now;
      }

    } catch (error) {
      console.error('Error in fetchMenu:', error);
      if (mounted.current) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false
        }));
      }
    }
  }, [userId, isHousehold, recipes]);

  // Suscribirse a cambios en el menú
  useEffect(() => {
    if (!userId) return;

    mounted.current = true;
    fetchMenu();

    const channel = supabase
      .channel('menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_menus',
          filter: `user_id=eq.${userId}`
        },
        () => {
          if (mounted.current) {
            fetchMenu(true);
          }
        }
      )
      .subscribe();

    return () => {
      mounted.current = false;
      channel.unsubscribe();
    };
  }, [userId, fetchMenu]);

  return state;
}

function transformWeeklyMenuToMenuItems(
  weeklyMenu: Record<string, any>,
  recipes: Recipe[]
): MenuItem[] {
  const menuItems: MenuItem[] = [];
  const days = [
    ['monday', 'Lunes'],
    ['tuesday', 'Martes'],
    ['wednesday', 'Miércoles'],
    ['thursday', 'Jueves'],
    ['friday', 'Viernes'],
    ['saturday', 'Sábado'],
    ['sunday', 'Domingo']
  ] as const;
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  days.forEach(([dbDay, displayDay]) => {
    meals.forEach(meal => {
      const recipeKey = `${dbDay}_${meal}_id`;
      const recipeId = weeklyMenu[recipeKey];
      
      if (recipeId && recipes.find(r => r.id === recipeId)) {
        menuItems.push({
          day: displayDay,
          meal: translateMeal(meal),
          recipe: recipes.find(r => r.id === recipeId)
        });
      }
    });
  });

  console.log('Generated menu items:', menuItems);
  return menuItems;
}

function translateMeal(meal: string): 'desayuno' | 'comida' | 'cena' | 'snack' {
  switch (meal) {
    case 'breakfast': return 'desayuno';
    case 'lunch': return 'comida';
    case 'dinner': return 'cena';
    case 'snack': return 'snack';
    default: return 'snack';
  }
}