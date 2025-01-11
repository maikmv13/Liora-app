import React from 'react';
import { ChefHat, Heart, ShoppingCart, Scale } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    recipes: number;
    favorites: number;
    shoppingLists: number;
    weightEntries: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { icon: ChefHat, label: 'Recetas', value: stats.recipes, color: 'rose' },
    { icon: Heart, label: 'Favoritos', value: stats.favorites, color: 'rose' },
    { icon: ShoppingCart, label: 'Listas', value: stats.shoppingLists, color: 'rose' },
    { icon: Scale, label: 'Registros', value: stats.weightEntries, color: 'rose' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4">
          <div className="flex items-center space-x-3">
            <div className={`bg-${color}-50 p-2 rounded-lg`}>
              <Icon size={20} className={`text-${color}-500`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}