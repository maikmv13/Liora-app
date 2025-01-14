import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { NutritionistProfile } from './NutritionistProfile';
import { UserProfile } from './UserProfile';

interface ProfileData {
  full_name: string;
  user_type: 'user' | 'nutritionist';
  email: string;
  specialization: string | null;
  license_number: string | null;
  created_at: string | null;
  updated_at: string | null;
  id: string;
  user_id: string;
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setProfile({
          ...profileData,
          email: user.email || '',
          user_type: profileData.user_type as 'user' | 'nutritionist'
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el perfil</p>
        </div>
      </div>
    );
  }

  return profile.user_type === 'nutritionist' ? <NutritionistProfile /> : <UserProfile />;
}