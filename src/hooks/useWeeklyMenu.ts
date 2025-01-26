import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WeeklyMenu {
  id: string;
  user_id?: string;
  linked_household_id?: string;
  monday_breakfast_id?: string;
  monday_lunch_id?: string;
  monday_dinner_id?: string;
  tuesday_breakfast_id?: string;
  tuesday_lunch_id?: string;
  tuesday_dinner_id?: string;
}

export function useWeeklyMenu() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isHouseholdMember, setIsHouseholdMember] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchWeeklyMenu() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('No hay usuario autenticado');

        // Primero obtenemos el household del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('linked_household_id')
          .eq('user_id', user.id)
          .single();

        if (profile?.linked_household_id) {
          console.log('Usuario pertenece a un household:', profile.linked_household_id);
          setIsHouseholdMember(true);

          // Si el usuario está en un household, buscamos el menú del household
          const { data: householdMenu, error: menuError } = await supabase
            .from('weekly_menus')
            .select('*')
            .eq('linked_household_id', profile.linked_household_id)
            .maybeSingle();

          if (menuError) {
            console.error('Error al buscar menú del household:', menuError);
          }

          if (householdMenu) {
            console.log('Menú del household encontrado:', householdMenu);
            // Archivamos el menú personal si existe
            const { error: archiveError } = await supabase
              .from('weekly_menus')
              .update({ status: 'archived' })
              .eq('user_id', user.id)
              .eq('status', 'active');

            if (archiveError) {
              console.error('Error al archivar menú personal:', archiveError);
            }

            if (!ignore) {
              setWeeklyMenu(householdMenu);
            }
          } else {
            console.log('No existe menú para este household');
            if (!ignore) {
              setWeeklyMenu(null); // Esto provocará que se muestre "Crea tu menú FAMILIAR"
            }
          }
        } else {
          console.log('Usuario no pertenece a ningún household');
          setIsHouseholdMember(false);

          // Si no está en un household, manejamos el menú personal
          const { data: personalMenu, error: menuError } = await supabase
            .from('weekly_menus')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (menuError) {
            console.error('Error al buscar menú personal:', menuError);
          }

          if (!ignore) {
            setWeeklyMenu(personalMenu);
          }
        }
      } catch (e) {
        console.error('Error fetching weekly menu:', e);
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchWeeklyMenu();
    return () => { ignore = true; };
  }, []);

  return { weeklyMenu, loading, error, isHouseholdMember };
} 