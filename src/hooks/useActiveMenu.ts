import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { supabase } from '../lib/supabase';

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setMenuItems([]);
          setActiveMenuId(null);
          setLoading(false);
          return;
        }

        // Primero obtenemos el menú activo más reciente
        const { data: activeMenu, error: menuError } = await supabase
          .from('weekly_menus')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (menuError) {
          // Si no hay menú activo, simplemente devolvemos un array vacío
          if (menuError.code === 'PGRST116') {
            setMenuItems([]);
            setActiveMenuId(null);
            setLoading(false);
            return;
          }
          throw menuError;
        }

        if (!activeMenu) {
          setMenuItems([]);
          setActiveMenuId(null);
          setLoading(false);
          return;
        }

        // Guardamos el ID del menú activo
        setActiveMenuId(activeMenu.id);

        // Obtenemos todas las recetas necesarias
        const recipeIds = Object.entries(activeMenu)
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
          setMenuItems([]);
          setLoading(false);
          return;
        }

        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', recipeIds);

        if (recipesError) {
          throw recipesError;
        }

        // Crear un mapa de recetas por ID para fácil acceso
        const recipesMap = new Map(recipes?.map(recipe => [recipe.id, recipe]));

        // Convertir el menú de la base de datos a MenuItem[]
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
            const recipeId = activeMenu[fieldName as keyof typeof activeMenu];
            
            if (recipeId && recipesMap.has(recipeId as string)) {
              const recipe = recipesMap.get(recipeId as string);
              items.push({
                day: dayMapping[day],
                meal: mealMapping[meal],
                recipe: recipe!
              });
            }
          }
        }

        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching active menu:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMenu();
  }, [userId]);

  return { menuItems, error, loading, activeMenuId };
}