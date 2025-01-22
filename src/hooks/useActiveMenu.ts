import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';
import { useActiveProfile } from './useActiveProfile';

export function useActiveMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { id, isHousehold, profile } = useActiveProfile();

  useEffect(() => {
    async function fetchActiveMenu() {
      try {
        setLoading(true);
        
        if (!id) return;

        console.log('Fetching active menu with:', {
          isHousehold,
          userId: id,
          householdId: profile?.household_id
        });

        // Construir la consulta base con alias únicos para cada join
        const query = supabase
          .from('weekly_menus')
          .select(`
            *,
            monday_breakfast:monday_breakfast_id(*),
            monday_lunch:monday_lunch_id(*),
            monday_snack:monday_snack_id(*),
            monday_dinner:monday_dinner_id(*),
            tuesday_breakfast:tuesday_breakfast_id(*),
            tuesday_lunch:tuesday_lunch_id(*),
            tuesday_snack:tuesday_snack_id(*),
            tuesday_dinner:tuesday_dinner_id(*),
            wednesday_breakfast:wednesday_breakfast_id(*),
            wednesday_lunch:wednesday_lunch_id(*),
            wednesday_snack:wednesday_snack_id(*),
            wednesday_dinner:wednesday_dinner_id(*),
            thursday_breakfast:thursday_breakfast_id(*),
            thursday_lunch:thursday_lunch_id(*),
            thursday_snack:thursday_snack_id(*),
            thursday_dinner:thursday_dinner_id(*),
            friday_breakfast:friday_breakfast_id(*),
            friday_lunch:friday_lunch_id(*),
            friday_snack:friday_snack_id(*),
            friday_dinner:friday_dinner_id(*),
            saturday_breakfast:saturday_breakfast_id(*),
            saturday_lunch:saturday_lunch_id(*),
            saturday_snack:saturday_snack_id(*),
            saturday_dinner:saturday_dinner_id(*),
            sunday_breakfast:sunday_breakfast_id(*),
            sunday_lunch:sunday_lunch_id(*),
            sunday_snack:sunday_snack_id(*),
            sunday_dinner:sunday_dinner_id(*)
          `)
          .eq('status', 'active');

        // Añadir el filtro correcto según el contexto
        if (isHousehold && profile?.household_id) {
          query.eq('household_id', profile.household_id);
        } else {
          query.eq('user_id', id);
        }

        const { data: activeMenu, error: menuError } = await query.single();

        if (menuError) {
          console.error('Error fetching menu:', menuError);
          throw menuError;
        }

        if (!activeMenu) {
          console.log('No active menu found');
          setMenuItems([]);
          return;
        }

        console.log('Active menu found:', activeMenu);

        // Transformar el menú en items
        const items: MenuItem[] = [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const meals = ['breakfast', 'lunch', 'snack', 'dinner'];
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
          'snack': 'snack',
          'dinner': 'cena'
        };

        days.forEach(day => {
          meals.forEach(meal => {
            // Usar el nuevo formato de alias para acceder a las recetas
            const recipe = activeMenu[`${day}_${meal}`];
            
            if (recipe) {
              items.push({
                day: dayMapping[day],
                meal: mealMapping[meal],
                recipe
              });
            }
          });
        });

        console.log('Transformed menu items:', items);
        setMenuItems(items);
        setError(null);
      } catch (e) {
        console.error('Error fetching active menu:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveMenu();
  }, [id, isHousehold, profile?.household_id]);

  return { menuItems, loading, error };
}