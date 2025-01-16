import React from 'react';
import { Check } from 'lucide-react';

interface FoodGroupProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  examples: string[];
  tips: string[];
}

export function FoodGroup({ name, icon, color, examples, tips }: FoodGroupProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 border-b border-rose-100 bg-gradient-to-r from-orange-50 to-rose-50">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${color.replace('500', '100')}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Alimentos recomendados</h4>
          <div className="flex flex-wrap gap-2">
            {examples.map(example => (
              <span
                key={example}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  color.replace('500', '50')
                } ${color.replace('bg', 'text').replace('500', '600')} border ${color.replace('bg', 'border').replace('500', '200')}`}
              >
                {example}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Consejos</h4>
          <ul className="space-y-2">
            {tips.map(tip => (
              <li key={tip} className="flex items-start space-x-2">
                <div className={`p-1 rounded-lg ${color.replace('500', '100')} flex-shrink-0 mt-0.5`}>
                  <Check className={`w-4 h-4 ${color.replace('bg', 'text')}`} />
                </div>
                <span className="text-gray-600 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}