import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useActiveProfile() {
  // Usar una función de inicialización para el estado inicial
  const [state, setState] = useState(() => {
    const cached = localStorage.getItem('userProfile');
    const parsedProfile = cached ? JSON.parse(cached) : null;
    return {
      profile: parsedProfile,
      loading: !parsedProfile,
      error: null as Error | null
    };
  });

  const mounted = useRef(true);
  const lastFetch = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const getProfile = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastFetch.current && now - lastFetch.current < CACHE_DURATION) {
      return;
    }

    if (!mounted.current) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        if (mounted.current) {
          localStorage.removeItem('userProfile');
          setState({
            profile: null,
            loading: false,
            error: null
          });
        }
        return;
      }

      // Verificar cache
      if (!force && 
          state.profile && 
          state.profile.user_id === session.user.id) {
        if (mounted.current) {
          setState(prev => ({ ...prev, loading: false }));
        }
        return;
      }

      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, user_type, linked_household_id, created_at, updated_at')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      if (mounted.current) {
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
        lastFetch.current = now;
        setState({
          profile: newProfile,
          loading: false,
          error: null
        });
      }

    } catch (e) {
      console.error('Error loading profile:', e);
      if (mounted.current) {
        setState(prev => ({
          ...prev,
          error: e as Error,
          loading: false
        }));
      }
    }
  }, [state.profile]);

  // Efecto inicial y suscripción a auth
  useEffect(() => {
    mounted.current = true;

    // Cargar perfil inicial
    getProfile();

    // Suscribirse a cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted.current) {
        getProfile(true);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [getProfile]);

  // Suscripción a cambios en el perfil
  useEffect(() => {
    if (!state.profile?.user_id) return;

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${state.profile.user_id}`
        },
        () => {
          if (mounted.current) {
            getProfile(true);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [state.profile?.user_id, getProfile]);

  return {
    id: state.profile?.user_id,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isHousehold: false,
    refreshProfile: useCallback(() => getProfile(true), [getProfile])
  };
}
