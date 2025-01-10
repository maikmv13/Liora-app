import React, { useEffect, useState } from 'react';
import { 
  User, UserCog, Mail, Calendar, FileCheck, Briefcase, Settings, LogOut, 
  ChefHat, Heart, ShoppingCart, Scale, Activity, Trophy, Star 
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
  const [stats, setStats] = useState<Stats>({
    recipes: 0,
    favorites: 0,
    shoppingLists: 0,
    weightEntries: 0
  });
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Primera receta', description: 'Añadiste tu primera receta', icon: ChefHat, achieved: true },
    { id: 2, title: 'Coleccionista', description: '10 recetas favoritas', icon: Heart, achieved: true },
    { id: 3, title: 'Planificador', description: 'Creaste 5 listas de compra', icon: ShoppingCart, achieved: false },
    { id: 4, title: 'Constante', description: '30 días registrando peso', icon: Scale, achieved: false }
  ]);

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
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // TODO: Implement actual stats loading from Supabase
    setStats({
      recipes: 12,
      favorites: 8,
      shoppingLists: 4,
      weightEntries: 15
    });
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
            <div className={`bg-gradient-to-r ${gradientColors} p-6 text-white`}>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  {isNutritionist ? (
                    <UserCog size={32} />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  <p className="text-white/80">
                    {isNutritionist ? 'Nutricionista' : 'Usuario'}
                  </p>
                </div>
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
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {/* TODO: Implementar edición de perfil */}}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={20} />
                    <span>Editar perfil</span>
                  </button>

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

          {/* Activity and Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart size={16} className="text-rose-500" />
                    <span className="text-sm text-gray-600">Creaste una lista de compra</span>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2d</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Trophy size={20} className="text-rose-500" />
                <span>Logros</span>
              </h2>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      achievement.achieved ? 'bg-amber-50/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <achievement.icon 
                        size={16} 
                        className={achievement.achieved ? 'text-amber-500' : 'text-gray-400'} 
                      />
                      <div>
                        <p className={`text-sm font-medium ${
                          achievement.achieved ? 'text-amber-700' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.achieved && (
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}