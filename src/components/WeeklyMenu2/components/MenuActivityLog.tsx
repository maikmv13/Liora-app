import React, { useEffect, useState } from 'react';
import { Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuActivity {
  id: string;
  user_id: string;
  linked_household_id: string | null;
  meal_type: string;
  day: string;
  recipe_id: string | null;
  action_type: 'add' | 'remove';
  created_at: string;
  // Campos calculados que obtendremos con joins
  user_name?: string;
  recipe_name?: string;
}

interface MenuActivityLogProps {
  activities: MenuActivity[];
  menuId: string;
}

export function MenuActivityLog({ activities: initialActivities, menuId }: MenuActivityLogProps) {
  const [activities, setActivities] = useState<MenuActivity[]>(initialActivities);

  useEffect(() => {
    setActivities([]);
  }, [menuId]);

  const getActionText = (activity: MenuActivity) => {
    if (activity.action_type === 'add') {
      return `ha añadido ${activity.recipe_name} al`;
    } else {
      return 'ha eliminado la receta del';
    }
  };

  return (
    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-700">Registro de Actividad</h3>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="mb-4">
              <Clock className="w-12 h-12 text-gray-300 mx-auto" />
            </div>
            <h4 className="text-base font-medium text-gray-700 mb-2">
              No hay actividad reciente
            </h4>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Aquí podrás ver un registro de todos los cambios realizados en el menú, 
              incluyendo cuando tú u otros miembros del hogar añadan o eliminen recetas.
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <User size={14} className="text-rose-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{activity.user_name}</span>
                  {' '}{getActionText(activity)}{' '}
                  <span className="font-medium text-gray-900">{activity.meal_type}</span>
                  {' '}del{' '}
                  <span className="font-medium text-gray-900">{activity.day}</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 