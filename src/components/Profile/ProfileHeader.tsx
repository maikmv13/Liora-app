import React from 'react';
import { User, UserCog, Settings, LogOut, Mail, Calendar, Shield, Sparkles, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  fullName: string;
  userType: 'user' | 'nutritionist';
  email: string;
  createdAt: string | null;
  onLogout: () => void;
  onEditProfile: () => void;
}

type ColorMapping = {
  [key in 'user' | 'nutritionist']: string;
};

export function ProfileHeader({
  fullName,
  userType,
  email,
  createdAt,
  onLogout,
  onEditProfile
}: ProfileHeaderProps) {
  const isNutritionist = userType === 'nutritionist';
  const gradientColors: ColorMapping = {
    nutritionist: 'from-emerald-400 via-teal-500 to-emerald-600',
    user: 'from-orange-400 via-pink-500 to-rose-500'
  };

  const bannerImages = {
    user: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    nutritionist: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1000&auto=format&fit=crop'
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100/30">
      {/* Banner de fondo con imagen */}
      <div className="relative h-36 md:h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{ backgroundImage: `url(${bannerImages[userType] || bannerImages.user})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Chips flotantes en el banner */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-white shadow-lg"
          >
            <Camera size={18} />
          </motion.button>
        </div>
      </div>

      {/* Profile Info Overlap */}
      <div className="relative px-6 pb-6 -mt-12 md:-mt-14 flex flex-col md:flex-row md:items-end justify-between items-center text-center md:text-left gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-white p-2 shadow-2xl border border-rose-50/50">
              <div className={`w-full h-full rounded-[1.5rem] bg-gradient-to-br ${gradientColors[userType] || gradientColors.user} flex items-center justify-center shadow-inner`}>
                {isNutritionist ? (
                  <UserCog className="w-10 h-10 md:w-14 md:h-14 text-white drop-shadow-md" />
                ) : (
                  <User className="w-10 h-10 md:w-14 md:h-14 text-white drop-shadow-md" />
                )}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-1 right-1 bg-white rounded-2xl p-2.5 shadow-xl border border-rose-50"
            >
              {isNutritionist ? (
                <Shield className="w-5 h-5 text-emerald-500" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-50" />
              )}
            </motion.div>
          </motion.div>

          {/* Name and Tag */}
          <div className="pb-2">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight drop-shadow-sm"
            >
              {fullName}
            </motion.h1>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center md:justify-start space-x-3 mt-2"
            >
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-sm bg-gradient-to-r ${gradientColors[userType] || gradientColors.user}`}>
                {isNutritionist ? 'Nutritionist' : 'Showcase User'}
              </span>
              <span className="text-gray-400 font-bold font-mono text-xs opacity-60">#{email.split('@')[0]}</span>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mb-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEditProfile}
            className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-2xl text-gray-800 font-bold border border-gray-100 transition-all shadow-sm active:shadow-inner"
          >
            <Settings size={18} className="text-gray-400" />
            <span className="hidden sm:inline">Ajustes</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="p-3 bg-rose-50 hover:bg-rose-100/80 rounded-2xl text-rose-600 border border-rose-100/50 transition-all shadow-sm active:shadow-inner"
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </div>

      {/* Info Grid - Visualmente más profesional */}
      <div className="grid grid-cols-2 border-t border-gray-50">
        <div className="p-5 flex items-center space-x-4 bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-50">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
            <Mail size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Email</p>
            <p className="text-sm font-bold text-gray-800 truncate">{email}</p>
          </div>
        </div>
        <div className="p-5 flex items-center space-x-4 bg-gradient-to-b from-white to-gray-50/30">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Miembro</p>
            <p className="text-sm font-bold text-gray-800">
              {new Date(createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}