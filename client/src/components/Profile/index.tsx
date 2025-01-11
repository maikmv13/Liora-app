import React, { useState, useEffect } from 'react';
import { 
  User, UserCog, Mail, Calendar, FileCheck, Briefcase, Settings, LogOut, 
  ChefHat, Heart, ShoppingCart, Scale, Activity, Trophy, Star, Edit2, Save, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfileData {
  full_name: string;
  user_type: 'user' | 'nutritionist';
  email: string;
  specialization?: string;
  license_number?: string;
  created_at: string;
}

interface Stats {
  recipes: number;
  favorites: number;
  shoppingLists: number;
  weightEntries: number;
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({});
  const [stats, setStats] = useState<Stats>({
    recipes: 0,
    favorites: 0,
    shoppingLists: 0,
    weightEntries: 0
  });

  useEffect(() => {
    loadProfile();
    loadStats();
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
          email: user.email || ''
        });
        setEditedProfile({
          ...profileData,
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Cargar favoritos
      const { data: favorites } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      // Cargar registros de peso (ejemplo)
      const { data: weightEntries } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id);

      setStats({
        recipes: 0, // Por ahora no hay recetas propias
        favorites: favorites?.length || 0,
        shoppingLists: 0, // Por implementar
        weightEntries: weightEntries?.length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          specialization: editedProfile.specialization,
          license_number: editedProfile.license_number
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev!,
        ...editedProfile
      }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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

  const isNutritionist = profile.user_type === 'nutritionist';
  const gradientColors = isNutritionist
    ? 'from-emerald-400 via-teal-500 to-emerald-600'
    : 'from-orange-400 via-pink-500 to-rose-500';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientColors} p-6 text-white relative`}>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  {isNutritionist ? (
                    <UserCog size={32} />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                {editing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editedProfile.full_name || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full bg-white/20 text-white placeholder-white/60 px-3 py-1.5 rounded-lg border border-white/30 focus:ring-2 focus:ring-white/50"
                      placeholder="Tu nombre completo"
                    />
                    <p className="text-white/80 mt-1">
                      {isNutritionist ? 'Nutricionista' : 'Usuario'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                    <p className="text-white/80">
                      {isNutritionist ? 'Nutricionista' : 'Usuario'}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Guardar cambios"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditedProfile(profile);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Cancelar"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Editar perfil"
                  >
                    <Edit2 size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Información personal
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Miembro desde {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isNutritionist && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Información profesional
                      </h2>
                      <div className="space-y-4">
                        {editing ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Especialización
                              </label>
                              <input
                                type="text"
                                value={editedProfile.specialization || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, specialization: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                                placeholder="Ej: Nutrición deportiva"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número de licencia
                              </label>
                              <input
                                type="text"
                                value={editedProfile.license_number || ''}
                                onChange={(e) => setEditedProfile(prev => ({ ...prev, license_number: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                                placeholder="Ej: 123456-N"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-3">
                              <Briefcase className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">{profile.specialization}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <FileCheck className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-600">
                                Licencia: {profile.license_number}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <ChefHat size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recetas</p>
                  <p className="text-xl font-bold text-gray-900">{stats.recipes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <Heart size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Favoritos</p>
                  <p className="text-xl font-bold text-gray-900">{stats.favorites}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <ShoppingCart size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listas</p>
                  <p className="text-xl font-bold text-gray-900">{stats.shoppingLists}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-2 rounded-lg">
                  <Scale size={20} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registros</p>
                  <p className="text-xl font-bold text-gray-900">{stats.weightEntries}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity size={20} className="text-rose-500" />
              <span>Actividad reciente</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Heart size={16} className="text-rose-500" />
                  <span className="text-sm text-gray-600">Añadiste una receta a favoritos</span>
                </div>
                <span className="text-xs text-gray-500">Hace 2h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Scale size={16} className="text-rose-500" />
                  <span className="text-sm text-gray-600">Nuevo registro de peso</span>
                </div>
                <span className="text-xs text-gray-500">Hace 1d</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}