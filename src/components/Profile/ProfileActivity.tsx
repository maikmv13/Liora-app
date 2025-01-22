import React from 'react';
import { Activity, Heart, Scale, ShoppingCart } from 'lucide-react';

interface ActivityItem {
  icon: React.ElementType;
  text: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  { icon: Heart, text: 'Añadiste una receta a favoritos', time: 'Hace 2h' },
  { icon: Scale, text: 'Nuevo registro de peso', time: 'Hace 1d' },
  { icon: ShoppingCart, text: 'Creaste una lista de compra', time: 'Hace 2d' }
];

export function ProfileActivity() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Activity size={20} className="text-rose-500" />
        <span>Actividad reciente</span>
      </h2>
      <div className="space-y-4">
        {recentActivity.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <item.icon size={16} className="text-rose-500" />
              <span className="text-sm text-gray-600">{item.text}</span>
            </div>
            <span className="text-xs text-gray-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}