import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setMenuItems([]);
          return;
        }

        const { data: activeMenu, error: menuError } = await supabase
          .from('weekly_menus')
          .select(`
            id,
            start_date,
            monday_breakfast_id(id, name, instructions, image_url, category),
            monday_lunch_id(id, name, instructions, image_url, category),
            monday_dinner_id(id, name, instructions, image_url, category),
            monday_snack_id(id, name, instructions, image_url, category),
            tuesday_breakfast_id(id, name, instructions, image_url, category),
            tuesday_lunch_id(id, name, instructions, image_url, category),
            tuesday_dinner_id(id, name, instructions, image_url, category),
            tuesday_snack_id(id, name, instructions, image_url, category),
            wednesday_breakfast_id(id, name, instructions, image_url, category),
            wednesday_lunch_id(id, name, instructions, image_url, category),
            wednesday_dinner_id(id, name, instructions, image_url, category),
            wednesday_snack_id(id, name, instructions, image_url, category),
            thursday_breakfast_id(id, name, instructions, image_url, category),
            thursday_lunch_id(id, name, instructions, image_url, category),
            thursday_dinner_id(id, name, instructions, image_url, category),
            thursday_snack_id(id, name, instructions, image_url, category),
            friday_breakfast_id(id, name, instructions, image_url, category),
            friday_lunch_id(id, name, instructions, image_url, category),
            friday_dinner_id(id, name, instructions, image_url, category),
            friday_snack_id(id, name, instructions, image_url, category),
            saturday_breakfast_id(id, name, instructions, image_url, category),
            saturday_lunch_id(id, name, instructions, image_url, category),
            saturday_dinner_id(id, name, instructions, image_url, category),
            saturday_snack_id(id, name, instructions, image_url, category),
            sunday_breakfast_id(id, name, instructions, image_url, category),
            sunday_lunch_id(id, name, instructions, image_url, category),
            sunday_dinner_id(id, name, instructions, image_url, category),
            sunday_snack_id(id, name, instructions, image_url, category)
          `)
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();
        
        if (menuError) {
          throw new Error(`Error al obtener el menú: ${menuError.message}`);
        }

        if (activeMenu) {
          const items: MenuItem[] = Object.entries(activeMenu)
            .filter(([key, value]) => 
              key.includes('breakfast_id') || 
              key.includes('lunch_id') || 
              key.includes('dinner_id') ||
              key.includes('snack_id')
            )
            .map(([key, recipe]) => {
              const [day, mealType] = key
                .replace('_id', '')
                .split('_');
              
              const mealTypeMap = {
                breakfast: 'desayuno',
                lunch: 'comida',
                dinner: 'cena',
                snack: 'snack'
              } as const;
              
              return {
                day,
                meal: mealTypeMap[mealType as keyof typeof mealTypeMap],
                recipe: recipe as any
              };
            })
            .filter(item => item.recipe !== null);

          setMenuItems(items);
        } else {
          setMenuItems([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Error desconocido al obtener el menú';
        setError(errorMessage);
        console.error('Error al obtener el menú activo:', err);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMenu();
  }, [userId]);

  return { menuItems, error, loading };
}