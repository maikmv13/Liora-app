import React from 'react';
import { Plus, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HabitsBannerProps {
  onAddHabit: () => void;
}

export function HabitsBanner({ onAddHabit }: HabitsBannerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 via-orange-600/80 to-amber-800/90" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Configuración de Hábitos
              </h1>
              <p className="text-amber-200 mt-1 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Construye hábitos positivos día a día</span>
              </p>
            </div>
          </div>

          {/* Add Button */}
          <motion.button
            onClick={onAddHabit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all duration-300"
          >
            <div className="p-1.5 bg-white/20 rounded-lg transition-colors group-hover:bg-white/30">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-white">
              Añadir Nuevo Hábito
            </span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400/20 to-amber-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}