import React from 'react';
import { ChefHat, Heart, Scale, Activity, Calendar, Star, Clock } from 'lucide-react';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import { useFavorites } from '../../hooks/useFavorites';

interface Favorite {
  id: string;
  name: string;
  created_at?: string;
}

export function UserProfile() {
  const { menuItems } = useActiveMenu();
  const { favorites } = useFavorites();

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Heart size={20} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Favoritos</p>
              <p className="text-xl font-bold text-gray-900">{favorites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Calendar size={20} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Menús</p>
              <p className="text-xl font-bold text-gray-900">{menuItems.length}</p>
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
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Activity size={20} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Actividad</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {favorites.slice(0, 5).map((favorite: Favorite) => (
            <div key={favorite.id} className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Heart size={16} className="text-rose-500" />
                <span className="text-sm text-gray-600">Añadiste {favorite.name} a favoritos</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(favorite.created_at)}
              </span>
            </div>
          ))}

          {favorites.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}