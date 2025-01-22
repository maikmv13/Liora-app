import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { NutritionistProfile } from './NutritionistProfile';
import { UserProfile } from './UserProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { HouseholdSection } from './HouseholdSection';
import { EditProfileModal } from './EditProfileModal';
import { useActiveProfile } from '../../hooks/useActiveProfile';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { useFavorites } from '../../hooks/useFavorites';

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
  household_id: string | null;
}

export function Profile() {
  const { id, isHousehold } = useActiveProfile();
  const { menuItems } = useActiveMenu(id, isHousehold);
  const { favorites } = useFavorites(isHousehold);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

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
      navigate('/menu');
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

  const stats = {
    recipes: favorites.length,
    favorites: favorites.length,
    shoppingLists: menuItems.length
  };

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
        onEditProfile={() => setShowEditModal(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileStats stats={stats} />
        <HouseholdSection 
          userId={profile.user_id}
          householdId={profile.household_id}
          onUpdate={loadProfile}
        />
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentProfile={{
          full_name: profile.full_name,
          email: profile.email
        }}
        onUpdate={loadProfile}
      />
    </div>
  );
}

export default Profile;