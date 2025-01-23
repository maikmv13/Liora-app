import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useActiveProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (!ignore) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, full_name, user_type')
          .eq('user_id', session.user.id)
          .limit(1)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        if (!ignore) {
          setProfile(data);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        if (!ignore) {
          setError(e as Error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    getProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (profile) {
      console.log('Active profile updated:', {
        id: profile.user_id,
        isHousehold: false,
        profile
      });
    }
  }, [profile]);

  return {
    id: profile?.user_id,
    profile,
    loading,
    error,
    isHousehold: false
  };
}
