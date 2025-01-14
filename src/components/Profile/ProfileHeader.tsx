import React from 'react';
import { User, UserCog, Settings, LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  fullName: string;
  userType: 'user' | 'nutritionist';
  email: string;
  createdAt: string | null;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function ProfileHeader({ 
  fullName, 
  userType, 
  email, 
  createdAt, 
  onLogout,
  onEditProfile 
}: ProfileHeaderProps) {
  const isNutritionist = userType === 'nutritionist';
  const gradientColors = isNutritionist
    ? 'from-emerald-400 via-teal-500 to-emerald-600'
    : 'from-orange-400 via-pink-500 to-rose-500';

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 overflow-hidden">
      {/* Header con gradiente */}
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
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-white/80">
              {isNutritionist ? 'Nutricionista' : 'Usuario'}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="bg-rose-50 p-2 rounded-lg">
                <User size={18} className="text-rose-500" />
              </div>
              <span>{email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="bg-rose-50 p-2 rounded-lg">
                <Settings size={18} className="text-rose-500" />
              </div>
              <span>Miembro desde {new Date(createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onEditProfile}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span>Editar perfil</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}