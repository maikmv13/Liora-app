import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Función para convertir los datos de la BD a MenuItem[]
  const convertToMenuItems = async (menu: any) => {
    try {
      // Obtener todas las recetas necesarias
      const recipeIds = Object.entries(menu)
        .filter(([key, value]) => 
          key.endsWith('_id') && 
          value !== null &&
          (key.includes('_breakfast_') || 
           key.includes('_lunch_') || 
           key.includes('_dinner_') || 
           key.includes('_snack_'))
        )
        .map(([_, value]) => value);

      if (recipeIds.length === 0) {
        return [];
      }

      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);

      if (recipesError) throw recipesError;

      // Crear un mapa de recetas por ID
      const recipesMap = new Map(recipes?.map(recipe => [recipe.id, recipe]));

      // Convertir el menú a MenuItem[]
      const items: MenuItem[] = [];
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
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

      for (const day of days) {
        for (const meal of meals) {
          const fieldName = `${day}_${meal}_id`;
          const recipeId = menu[fieldName];
          
          if (recipeId && recipesMap.has(recipeId)) {
            const recipe = recipesMap.get(recipeId);
            items.push({
              day: dayMapping[day],
              meal: mealMapping[meal],
              recipe: recipe!
            });
          }
        }
      }

      return items;
    } catch (error) {
      console.error('Error converting menu:', error);
      return [];
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchActiveMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setMenuItems([]);
          setActiveMenuId(null);
          return;
        }

        // Obtener el menú activo
        const { data: activeMenu, error: menuError } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (menuError) {
          if (menuError.code === 'PGRST116') {
            setMenuItems([]);
            setActiveMenuId(null);
            return;
          }
          throw menuError;
        }

        if (!activeMenu) {
          setMenuItems([]);
          setActiveMenuId(null);
          return;
        }

        // Guardar el ID del menú activo
        setActiveMenuId(activeMenu.id);

        // Convertir a MenuItem[]
        const items = await convertToMenuItems(activeMenu);
        if (!ignore) {
          setMenuItems(items);
        }
      } catch (err) {
        console.error('Error fetching active menu:', err);
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error al cargar el menú');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchActiveMenu();

    // Suscribirse a cambios en el menú activo
    const subscription = supabase
      .channel('weekly_menus_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_menus',
          filter: `user_id=eq.${userId} AND status=eq.active`
        },
        async (payload) => {
          console.log('Menu changed:', payload);
          if (!ignore) {
            const items = await convertToMenuItems(payload.new);
            setMenuItems(items);
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