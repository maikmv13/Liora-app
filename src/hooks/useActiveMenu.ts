import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase, retryOperation } from '../lib/supabase';

// Helper function to convert DB menu to MenuItem array
const convertToMenuItems = async (menu: any, recipes: any[]): Promise<MenuItem[]> => {
  const items: MenuItem[] = [];
  const dayMapping: Record<string, string> = {
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
  };

  const mealMapping: Record<string, string> = {
    'breakfast': 'desayuno',
    'lunch': 'comida',
    'dinner': 'cena',
    'snack': 'snack'
  };

  // Iterate through days and meals
  for (const [dbDay, day] of Object.entries(dayMapping)) {
    for (const [dbMeal, meal] of Object.entries(mealMapping)) {
      const recipeId = menu[`${dbDay}_${dbMeal}_id`];
      if (recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          items.push({
            day,
            meal,
            recipe: {
              ...recipe,
              meal_type: meal
            }
          });
        }
      }
    }
  }

  return items;
};

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchActiveMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user if not provided
        let currentUserId = userId;
        if (!currentUserId) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (!user) {
            setMenuItems([]);
            setActiveMenuId(null);
            return;
          }
          currentUserId = user.id;
        }

        // Get active menu
        const { data: menus, error: menuError } = await retryOperation(() =>
          supabase
            .from('weekly_menus')
            .select('*')
            .eq('user_id', currentUserId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
        );

        if (menuError) {
          if (menuError.code === 'PGRST116') {
            // No results found - not an error
            setMenuItems([]);
            setActiveMenuId(null);
            return;
          }
          throw menuError;
        }

        if (!menus || menus.length === 0) {
          setMenuItems([]);
          setActiveMenuId(null);
          return;
        }

        const activeMenu = menus[0];
        if (!ignore) setActiveMenuId(activeMenu.id);

        // Get recipe IDs from menu
        const recipeIds = Object.entries(activeMenu)
          .filter(([key, value]) => 
            key.endsWith('_id') && 
            value !== null &&
            typeof value === 'string'
          )
          .map(([_, value]) => value as string);

        if (recipeIds.length > 0) {
          // Get recipes
          const { data: recipes, error: recipesError } = await retryOperation(() =>
            supabase
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
              .in('id', recipeIds)
          );

          if (recipesError) throw recipesError;

          // Convert to menu items
          const items = await convertToMenuItems(activeMenu, recipes || []);
          if (!ignore) {
            setMenuItems(items);
          }
        } else {
          if (!ignore) setMenuItems([]);
        }
      } catch (err) {
        console.error('Error fetching active menu:', err);
        if (!ignore) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(fetchActiveMenu, 1000 * Math.pow(2, retryCount));
          } else {
            setError('Error al cargar el menú. Por favor, intenta de nuevo.');
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchActiveMenu();

    // Set up realtime subscription
    const subscription = supabase
      .channel('menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_menus',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        () => {
          if (!ignore) {
            fetchActiveMenu();
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [userId]);

  return { menuItems, error, loading, activeMenuId };
}