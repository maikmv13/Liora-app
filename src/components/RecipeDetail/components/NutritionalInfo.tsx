import { Scale, Flame, Cookie, Beef, Wheat, Egg, Droplets, ChevronDown } from 'lucide-react';
import type { Recipe } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';

interface NutritionalInfoProps {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export function NutritionalInfo({ recipe, isExpanded, onToggle }: NutritionalInfoProps) {
  const nutritionalInfo = [
    { label: 'Calorías', value: recipe.calories || '0 kcal', icon: Flame, color: 'rose' },
    { label: 'Proteínas', value: recipe.proteins || '0 g', icon: Egg, color: 'emerald' },
    { label: 'Carbohidratos', value: recipe.carbohydrates || '0 g', icon: Cookie, color: 'amber' },
    { label: 'Grasas', value: recipe.fats || '0 g', icon: Beef, color: 'blue' },
    { label: 'Fibra', value: recipe.fiber || '0 g', icon: Wheat, color: 'orange' },
    { label: 'Sodio', value: recipe.sodium || '0 mg', icon: Droplets, color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <Scale size={20} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">Información Nutricional</h2>
            <p className="text-sm text-gray-500 text-left">Por persona</p>
          </div>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border-t border-gray-100">
              {nutritionalInfo.map(({ label, value, icon: Icon, color }) => (
                <div 
                  key={label}
                  className={`flex items-center space-x-3 p-3 bg-${color}-50 rounded-xl`}
                >
                  <Icon size={20} className={`text-${color}-500 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{label}</p>
                    <p className="font-medium text-sm truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}