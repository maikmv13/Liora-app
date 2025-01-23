import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

export function useActiveMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchMenuItems() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setMenuItems([]);
          return;
        }

        const { data, error: menuError } = await supabase
          .from('weekly_menus')
          .select(`
            id,
            user_id,
            monday_breakfast_id(id, name, description),
            monday_lunch_id(id, name, description),
            monday_dinner_id(id, name, description),
            monday_snack_id(id, name, description)
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (menuError) throw menuError;

        if (!ignore) {
          const transformedItems = transformWeeklyMenuToMenuItems(data?.[0]);
          setMenuItems(transformedItems);
        }
      } catch (e) {
        if (!ignore) setError(e as Error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchMenuItems();
    return () => { ignore = true; };
  }, []);

  return { menuItems, loading, error };
}

function transformWeeklyMenuToMenuItems(weeklyMenu: any): MenuItem[] {
  if (!weeklyMenu) return [];
  
  const menuItems: MenuItem[] = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  days.forEach(day => {
    meals.forEach(meal => {
      const recipeKey = `${day}_${meal}_id`;
      if (weeklyMenu[recipeKey]) {
        menuItems.push({
          day,
          meal,
          recipe: weeklyMenu[recipeKey]
        });
      }
    });
  });

  return menuItems;
}