import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { 
  Calendar, 
  Flame, 
  Clock, 
  Sun, 
  Moon, 
  Coffee, 
  Cookie, 
  Check,
  X,
  Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TodayCardProps {
  menuItems: MenuItem[];
  onViewRecipe: (menuItem: MenuItem) => void;
  activeMenu?: any;
}

export function TodayCard({ menuItems, onViewRecipe, activeMenu }: TodayCardProps) {
  const [completions, setCompletions] = useState<Record<string, any>>({});
  
  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long' 
  }).format(new Date());

  const todayFormatted = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchCompletions();
  }, [menuItems]);

  const fetchCompletions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('recipe_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('day', todayFormatted);

      if (error) throw error;

      const completionsMap = (data || []).reduce((acc, completion) => ({
        ...acc,
        [completion.recipe_id]: completion
      }), {});

      setCompletions(completionsMap);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  const handleToggleCompletion = async (menuItem: MenuItem, skipped = false) => {
    try {
      if (!activeMenu) {
        console.error('No active menu found');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existingCompletion = completions[menuItem.recipe.id];

      // If there's an existing completion, delete it
      if (existingCompletion) {
        const { error: deleteError } = await supabase
          .from('recipe_completions')
          .delete()
          .eq('id', existingCompletion.id);

        if (deleteError) throw deleteError;

        // Update local state
        setCompletions(prev => {
          const newCompletions = { ...prev };
          delete newCompletions[menuItem.recipe.id];
          return newCompletions;
        });
        return;
      }

      // Create new completion
      const { data, error } = await supabase
        .from('recipe_completions')
        .upsert({
          user_id: user.id,
          recipe_id: menuItem.recipe.id,
          menu_id: activeMenu.id,
          day: todayFormatted,
          meal_type: menuItem.meal,
          skipped,
          skipped_reason: skipped ? 'Skipped manually' : null,
          rating: null,
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCompletions(prev => ({
          ...prev,
          [menuItem.recipe.id]: data
        }));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const totalCalorias = menuItems.reduce((total, item) => {
    const calories = parseInt(item.recipe.calories?.replace(/\D/g, '') || '0');
    return total + calories;
  }, 0);

  const mealTypes = ['desayuno', 'comida', 'snack', 'cena'];

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'desayuno':
        return <Coffee size={14} className="text-amber-500" />;
      case 'comida':
        return <Sun size={14} className="text-orange-500" />;
      case 'snack':
        return <Cookie size={14} className="text-emerald-500" />;
      case 'cena':
        return <Moon size={14} className="text-indigo-500" />;
      default:
        return null;
    }
  };

  const getMealTime = (meal: string): string => {
    switch (meal) {
      case 'desayuno':
        return '8:00';
      case 'comida':
        return '14:00';
      case 'snack':
        return '17:00';
      case 'cena':
        return '21:00';
      default:
        return '';
    }
  };

  const getMealColor = (meal: string): string => {
    switch (meal) {
      case 'desayuno':
        return 'bg-amber-50 border-amber-100 hover:bg-amber-100/50';
      case 'comida':
        return 'bg-orange-50 border-orange-100 hover:bg-orange-100/50';
      case 'snack':
        return 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50';
      case 'cena':
        return 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50';
      default:
        return 'bg-rose-50 border-rose-100 hover:bg-rose-100/50';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-rose-100/20 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center space-x-2">
          <div className="bg-rose-100 p-1.5 rounded-lg">
            <Calendar size={14} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">{today}</h3>
          </div>
        </div>
        {totalCalorias > 0 && (
          <div className="flex items-center space-x-1 bg-white/80 px-2 py-1 rounded-lg border border-rose-100">
            <Flame size={12} className="text-rose-500" />
            <span className="text-xs font-medium text-rose-600">{totalCalorias} kcal</span>
          </div>
        )}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 divide-y divide-rose-100/10">
        {mealTypes.map((mealType) => {
          const menuItem = menuItems.find(item => {
            if (mealType === 'desayuno') {
              return item.meal === 'desayuno';
            }
            if (mealType === 'snack') {
              return item.meal === 'snack';
            }
            return item.meal === mealType;
          });
          
          const isCompleted = menuItem && completions[menuItem.recipe.id]?.completed_at;
          const isSkipped = menuItem && completions[menuItem.recipe.id]?.skipped;
          
          return (
            <div
              key={mealType}
              className={`group flex items-center p-2 transition-colors ${
                menuItem ? getMealColor(mealType) : 'hover:bg-gray-50'
              }`}
            >
              {/* Time and Icon */}
              <div className="flex items-center space-x-2 w-20 flex-shrink-0">
                <div className={`p-1.5 rounded-lg ${menuItem ? 'bg-white/50' : 'bg-gray-50'}`}>
                  {getMealIcon(mealType)}
                </div>
                <span className="text-[10px] font-medium text-gray-500">
                  {getMealTime(mealType)}
                </span>
              </div>

              {menuItem ? (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                        {menuItem.recipe.name}
                      </h4>
                      {isCompleted && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-600">
                          <Check size={10} className="flex-shrink-0" />
                          <span>Completada</span>
                        </span>
                      )}
                      {isSkipped && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-600">
                          <X size={10} className="flex-shrink-0" />
                          <span>Saltada</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        {menuItem.recipe.category}
                      </span>
                      <div className="flex items-center space-x-1 bg-white/80 px-1.5 py-0.5 rounded-lg">
                        <Flame size={10} className="text-rose-500" />
                        <span className="text-[10px] font-medium text-rose-600">
                          {menuItem.recipe.calories}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    {!isCompleted && !isSkipped && (
                      <>
                        <button
                          onClick={() => handleToggleCompletion(menuItem)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marcar como completada"
                        >
                          <Check size={16} className="stroke-2" />
                        </button>
                        <button
                          onClick={() => handleToggleCompletion(menuItem, true)}
                          className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Marcar como saltada"
                        >
                          <X size={16} className="stroke-2" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onViewRecipe(menuItem)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Ver receta"
                    >
                      <Eye size={16} className="stroke-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 text-left">
                  <span className="text-sm text-gray-500">Sin planificar</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}