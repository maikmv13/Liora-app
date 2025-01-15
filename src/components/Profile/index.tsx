import React, { useState, useEffect } from 'react';
import { ChefHat, Calendar, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { NutritionistProfile } from './NutritionistProfile';
import { UserProfile } from './UserProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileActivity } from './ProfileActivity';
import { ProfileAchievements } from './ProfileAchievements';

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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

  // Stats for the user
  const stats = {
    recipes: 24,
    favorites: 12,
    shoppingLists: 8,
    weightEntries: 30
  };

  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: 'Chef Principiante',
      description: 'Completa tu primera receta',
      icon: ChefHat,
      achieved: true
    },
    {
      id: 2,
      title: 'Planificador Experto',
      description: 'Crea 5 menús semanales',
      icon: Calendar,
      achieved: true
    },
    {
      id: 3,
      title: 'Saludable',
      description: 'Registra tu peso durante 30 días',
      icon: Activity,
      achieved: false
    }
  ];

  if (profile.user_type === 'nutritionist') {
    return <NutritionistProfile />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        fullName={profile.full_name}
        userType={profile.user_type}
        email={profile.email}
        createdAt={profile.created_at}
        onLogout={handleLogout}
        onEditProfile={() => {/* TODO: Implement edit profile */}}
      />

      <ProfileStats stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileActivity />
        <ProfileAchievements achievements={achievements} />
      </div>
    </div>
  );
}