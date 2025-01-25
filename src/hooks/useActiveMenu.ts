import { useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem, Recipe } from '../types';
import { supabase } from '../lib/supabase';
import { useRecipes } from './useRecipes';
import { transformWeeklyMenuToMenuItems } from '../utils/menuTransforms';

export function useActiveMenu(userId: string | undefined, isHousehold: boolean) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { recipes } = useRecipes();
  const mounted = useRef(true);

  const fetchMenu = useCallback(async () => {
    if (!userId || !recipes.length) {
      if (mounted.current) {
        setMenuItems([]);
        setLoading(false);
      }
      return;
    }

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
        if (mounted.current) {
          setMenuItems([]);
          setLoading(false);
        }
        return;
      }

      // 3. Obtener recetas del menú
      const recipeIds = Object.entries(menu)
        .filter(([key, value]) => 
          key.endsWith('_id') && 
          typeof value === 'string' && 
          value.length > 0
        )
        .map(([_, value]) => value);

      if (recipeIds.length === 0) {
        if (mounted.current) {
          setMenuItems([]);
          setLoading(false);
        }
        return;
      }

      // Obtener las recetas en lotes de 100 para evitar URLs muy largas
      const batchSize = 100;
      const recipeBatches = [];
      
      for (let i = 0; i < recipeIds.length; i += batchSize) {
        const batch = recipeIds.slice(i, i + batchSize);
        const { data: recipes } = await supabase
          .from('recipes')
          .select('*')
          .in('id', batch);
        
        if (recipes) {
          recipeBatches.push(...recipes);
        }
      }

      if (!mounted.current) return;

      if (!recipeBatches.length) {
        throw new Error('No se pudieron obtener las recetas del menú');
      }

      // 4. Procesar y transformar datos
      const recipeMap = new Map(recipeBatches.map(recipe => [recipe.id, recipe]));
      const transformedItems = transformWeeklyMenuToMenuItems(
        menu,
        Array.from(recipeMap.values())
      );

      if (mounted.current) {
        setMenuItems(transformedItems);
        setError(null);
        setLoading(false);
      }

    } catch (error) {
      console.error('Error in fetchMenu:', error);
      if (mounted.current) {
        setError(error as Error);
        setMenuItems([]);
        setLoading(false);
      }
    }
  }, [userId, isHousehold, recipes]);

  useEffect(() => {
    mounted.current = true;
    fetchMenu();
    return () => {
      mounted.current = false;
    };
  }, [fetchMenu]);

  return {
    menuItems,
    loading,
    error
  };
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