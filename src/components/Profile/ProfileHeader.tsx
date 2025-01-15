import React from 'react';
import { User, UserCog, Settings, LogOut, Mail, Calendar, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-current to-transparent" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-current to-transparent" />
      </div>

      {/* Header Content */}
      <div className={`relative px-6 pt-8 pb-6 bg-gradient-to-r ${gradientColors}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-lg">
                {isNutritionist ? (
                  <UserCog className="w-10 h-10 text-white" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -bottom-2 -right-2 bg-white rounded-lg p-1.5 shadow-lg"
              >
                {isNutritionist ? (
                  <Shield className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
              </motion.div>
            </motion.div>

            <div className="space-y-1">
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {fullName}
              </motion.h1>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-2"
              >
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-sm text-white border border-white/20">
                  {isNutritionist ? 'Nutricionista' : 'Usuario'}
                </span>
                <span className="text-white/80 text-sm">#{email.split('@')[0]}</span>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Editar Perfil</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-white">
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-50">
              <Mail className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{email}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-50">
              <Calendar className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        {/* Additional stats can be added here */}
      </div>
    </div>
  );
}