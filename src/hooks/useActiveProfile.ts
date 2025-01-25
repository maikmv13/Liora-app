import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useActiveProfile() {
  const [state, setState] = useState(() => {
    const cached = localStorage.getItem('userProfile');
    return {
      profile: cached ? JSON.parse(cached) : null,
      loading: !cached,
      error: null as Error | null
    };
  });

  const mounted = useRef(true);
  const lastFetch = useRef<number>(0);
  const CACHE_DURATION = 30000; // 30 segundos

  const fetchProfile = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastFetch.current && now - lastFetch.current < CACHE_DURATION) {
      return;
    }

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

      // Verificar caché solo si no es forzado
      if (!force && state.profile?.user_id === session.user.id) {
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      if (mounted.current) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        lastFetch.current = now;
        setState({
          profile,
          loading: false,
          error: null
        });
      }

    } catch (error) {
      console.error('Error loading profile:', error);
      if (mounted.current) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false
        }));
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchProfile(); // Carga inicial

    // Suscripciones
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted.current) fetchProfile(true);
    });

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => { if (mounted.current) fetchProfile(true); }
      )
      .subscribe();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    id: state.profile?.user_id,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isHousehold: false,
    refreshProfile: useCallback(() => fetchProfile(true), [fetchProfile])
  };
}
