import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { getActiveMenu, convertDBToMenuItems } from '../services/weeklyMenu';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useActiveMenu(userId?: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let ignore = false;
    let subscription: any;
    let retryCount = 0;

    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      if (!ignore) {
        setIsConnected(connected);
      }
      return connected;
    };

    async function fetchActiveMenu() {
      try {
        // Check connection first
        const connected = await checkConnection();
        if (!connected) {
          throw new Error('No connection to database');
        }

        let effectiveUserId = userId;
        if (!effectiveUserId) {
          const { data: { user } } = await supabase.auth.getUser();
          effectiveUserId = user?.id;
        }

        if (!effectiveUserId) {
          setMenuItems([]);
          setLoading(false);
          return;
        }

        const activeMenu = await getActiveMenu(effectiveUserId);
        
        if (!ignore) {
          if (activeMenu) {
            const items = await convertDBToMenuItems(activeMenu);
            setMenuItems(items);
          } else {
            setMenuItems([]);
          }
          setError(null);
        }
      } catch (err) {
        console.error('Error al obtener el menú activo:', err);
        if (!ignore) {
          setError(err as Error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying fetch (${retryCount}/${MAX_RETRIES}) after ${RETRY_DELAY * retryCount}ms...`);
            setTimeout(fetchActiveMenu, RETRY_DELAY * retryCount);
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    fetchActiveMenu();

    // Set up real-time subscription only if we have a connection
    if (userId && isConnected) {
      subscription = supabase
        .channel('menu_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'weekly_menus',
            filter: `user_id=eq.${userId} AND status=eq.active`
          },
          async () => {
            if (!ignore) {
              await fetchActiveMenu();
            }
          }
        )
        .subscribe();
    }

    return () => {
      ignore = true;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [userId, isConnected]);

  return { menuItems, loading, error, isConnected };
}