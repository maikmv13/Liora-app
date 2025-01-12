import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, Scale, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileActivity } from './ProfileActivity';
import { ProfileAchievements } from './ProfileAchievements';
import { AddRecipeForm } from './AddRecipeForm';

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
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [stats] = useState({
    recipes: 12,
    favorites: 8,
    shoppingLists: 4,
    weightEntries: 15
  });
  const [achievements] = useState([
    { id: 1, title: 'Primera receta', description: 'Añadiste tu primera receta', icon: ChefHat, achieved: true },
    { id: 2, title: 'Coleccionista', description: '10 recetas favoritas', icon: Heart, achieved: true },
    { id: 3, title: 'Planificador', description: 'Creaste 5 listas de compra', icon: Scale, achieved: false },
    { id: 4, title: 'Constante', description: '30 días registrando peso', icon: Activity, achieved: false }
  ]);

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
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el perfil</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileHeader 
            fullName={profile.full_name}
            userType={profile.user_type}
            email={profile.email}
            createdAt={profile.created_at || ''}
            onLogout={handleLogout}
            onEditProfile={() => {/* TODO: Implementar edición */}}
          />

          <ProfileStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileActivity />
            <ProfileAchievements achievements={achievements} />
          </div>

          {profile.user_type === 'nutritionist' && (
            <button
              onClick={() => setShowAddRecipe(true)}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <ChefHat size={20} />
              <span>Añadir Nueva Receta</span>
            </button>
          )}
        </div>
      </div>

      {showAddRecipe && (
        <AddRecipeForm onClose={() => setShowAddRecipe(false)} />
      )}
    </div>
  );
}