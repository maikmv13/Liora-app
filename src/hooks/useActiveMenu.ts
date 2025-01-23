import { useState, useEffect } from 'react';
import { MenuItem, Recipe } from '../types';
import { supabase } from '../lib/supabase';

export function useActiveMenu(userId: string | undefined, isHousehold: boolean) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided to useActiveMenu');
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        console.log('Fetching menu for:', { userId, isHousehold });
        
        // 1. Obtener el menú más reciente
        const { data: menuData, error: menuError } = await supabase
          .from('weekly_menus')
          .select(`
            id,
            user_id,
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
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (menuError) {
          console.error('Error fetching menu:', menuError);
          throw menuError;
        }

        if (!menuData) {
          console.log('No menu found for user:', userId);
          setMenuItems([]);
          setLoading(false);
          return;
        }

        console.log('Found menu:', menuData);

        // 2. Filtrar solo los IDs de recetas válidos
        const recipeIds = Object.entries(menuData)
          .filter(([key, value]) => 
            key.endsWith('_id') && 
            key !== 'user_id' && 
            value !== null
          )
          .map(([_, value]) => value);

        if (recipeIds.length === 0) {
          console.log('No recipes in menu');
          setMenuItems([]);
          setLoading(false);
          return;
        }

        console.log('Recipe IDs to fetch:', recipeIds);

        // 3. Obtener las recetas
        const { data: recipesData, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', recipeIds);

        if (recipesError) {
          console.error('Error fetching recipes:', recipesError);
          throw recipesError;
        }

        console.log('Fetched recipes:', recipesData);

        // 4. Transformar en MenuItems
        const items = transformWeeklyMenuToMenuItems(menuData, recipesData || []);
        console.log('Transformed menu items:', items);

        setMenuItems(items);
      } catch (e) {
        console.error('Error in fetchMenu:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [userId, isHousehold]);

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