import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  user_id: string;
  household_id: string | null;
  full_name: string;
  user_type: string;
}

export function useActiveProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user) {
          setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        if (!ignore) {
          setProfile(data);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        if (!ignore) setError(e as Error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (profile) {
      console.log('Active profile updated:', {
        id: profile.user_id,
        isHousehold: Boolean(profile.household_id),
        profile
      });
    }
  }, [profile]);

  const isHousehold = Boolean(profile?.household_id);

  return {
    id: profile?.user_id,
    profile,
    loading,
    error,
    isHousehold
  };
}
