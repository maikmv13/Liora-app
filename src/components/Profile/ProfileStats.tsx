import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useShoppingList } from '../../hooks/useShoppingList';
import { useActiveProfile } from '../../hooks/useActiveProfile';

interface ProfileStatsProps {
  stats: {
    recipes: number;
    favorites: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const { id, isHousehold } = useActiveProfile();
  const { shoppingList } = useShoppingList(id, isHousehold);
  
  // Calcular items pendientes de compra
  const pendingItems = shoppingList.filter(item => !item.checked).length;

  const statItems = [
    { 
      icon: Heart, 
      label: 'Recetas Favoritas', 
      value: stats.favorites,
      colorClass: { bg: 'bg-rose-50', text: 'text-rose-500' }
    },
    { 
      icon: ShoppingCart, 
      label: 'Por Comprar', 
      value: pendingItems,
      colorClass: { bg: 'bg-emerald-50', text: 'text-emerald-500' }
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statItems.map(({ icon: Icon, label, value, colorClass }) => (
        <div 
          key={label} 
          className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100/20 p-4 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className={`${colorClass.bg} p-2 rounded-lg`}>
              <Icon size={20} className={colorClass.text} />
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