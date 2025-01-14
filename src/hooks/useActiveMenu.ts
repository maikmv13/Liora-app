import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MenuItem } from '../types';

export function useActiveMenu(userId: string | undefined) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchActiveMenu() {
      if (!userId) {
        setMenuItems([]);
        setLoading(false);
        return;
      }

      try {
        // 1. Obtenemos el menú más reciente con una consulta más simple
        const { data: menuData, error: menuError } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (menuError) throw menuError;
        if (!menuData) {
          setMenuItems([]);
          return;
        }

        // 2. Creamos un array con los IDs de las recetas no nulas
        const mealFields = [
          'monday_breakfast_id', 'monday_lunch_id', 'monday_dinner_id',
          'tuesday_breakfast_id', 'tuesday_lunch_id', 'tuesday_dinner_id',
          'wednesday_breakfast_id', 'wednesday_lunch_id', 'wednesday_dinner_id',
          'thursday_breakfast_id', 'thursday_lunch_id', 'thursday_dinner_id',
          'friday_breakfast_id', 'friday_lunch_id', 'friday_dinner_id',
          'saturday_breakfast_id', 'saturday_lunch_id', 'saturday_dinner_id',
          'sunday_breakfast_id', 'sunday_lunch_id', 'sunday_dinner_id'
        ];

        const recipeIds = mealFields
          .map(field => menuData[field])
          .filter((id): id is number => id !== null);

        if (recipeIds.length === 0) {
          setMenuItems([]);
          return;
        }

        // 3. Obtenemos las recetas en una sola consulta
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select()
          .in('id', recipeIds);

        if (recipesError) throw recipesError;
        if (!recipesData) return;

        // 4. Construimos el array de MenuItems
        const items: MenuItem[] = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const meals = ['breakfast', 'lunch', 'dinner'];

        for (const day of days) {
          for (const meal of meals) {
            const recipeId = menuData[`${day}_${meal}_id`];
            if (recipeId) {
              const recipe = recipesData.find(r => r.id === recipeId);
              if (recipe) {
                items.push({
                  day,
                  meal,
                  recipe
                });
              }
            }
          }
        }

        if (!ignore) {
          setMenuItems(items);
        }
      } catch (e) {
        console.error('Error fetching active menu:', e);
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchActiveMenu();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return { menuItems, loading, error };
}