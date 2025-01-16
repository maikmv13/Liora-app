import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MenuItem } from '../types';
import { getActiveMenu } from '../services/weeklyMenu';

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMenu = async () => {
      try {
        if (!userId) {
          setMenuItems([]);
          setLoading(false);
          return;
        }

        const { data: activeMenu, error } = await getActiveMenu(userId);
        if (error) throw error;

        if (activeMenu) {
          setMenuItems(activeMenu.menu_items || []);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching active menu:', error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMenu();
  }, [userId]);

  return { menuItems, loading };
}