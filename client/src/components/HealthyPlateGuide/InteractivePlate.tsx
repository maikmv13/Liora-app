import React, { useState } from 'react';
import { FoodGroupType } from './types';

interface InteractivePlateProps {
  foodGroups: FoodGroupType[];
  selectedGroup: FoodGroupType | null;
  onSelectGroup: (group: FoodGroupType) => void;
}

export function InteractivePlate({ foodGroups, selectedGroup, onSelectGroup }: InteractivePlateProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  return (
    <div className="relative max-w-4xl mx-auto pt-20 pb-32">
      {/* Plato principal */}
      <div className="relative aspect-square max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] border-8 border-gray-100">
          {/* Divisiones del plato */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Líneas divisorias */}
            <path
              d="M50,0 L50,100 M50,50 L100,50"
              className="stroke-white stroke-[3]"
              strokeLinecap="round"
              fill="none"
            />

            {/* Verduras (50%) */}
            <path
              d="M0,0 L50,0 L50,50 L0,50 Z"
              className={`${foodGroups[0].color} transition-colors duration-300 ${
                hoveredGroup === 'vegetables' ? 'opacity-100' : 'opacity-90'
              }`}
              onMouseEnter={() => setHoveredGroup('vegetables')}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={() => onSelectGroup(foodGroups[0])}
            />

            {/* Proteínas (25%) */}
            <path
              d="M50,50 L100,50 L100,100 L50,100 Z"
              className={`${foodGroups[1].color} transition-colors duration-300 ${
                hoveredGroup === 'proteins' ? 'opacity-100' : 'opacity-90'
              }`}
              onMouseEnter={() => setHoveredGroup('proteins')}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={() => onSelectGroup(foodGroups[1])}
            />

            {/* Carbohidratos (25%) */}
            <path
              d="M50,0 L100,0 L100,50 L50,50 Z"
              className={`${foodGroups[2].color} transition-colors duration-300 ${
                hoveredGroup === 'carbs' ? 'opacity-100' : 'opacity-90'
              }`}
              onMouseEnter={() => setHoveredGroup('carbs')}
              onMouseLeave={() => setHoveredGroup(null)}
              onClick={() => onSelectGroup(foodGroups[2])}
            />
          </svg>

          {/* Etiquetas permanentes */}
          {foodGroups.map((group) => {
            const isActive = hoveredGroup === group.id;
            const positions = {
              vegetables: { top: '25%', left: '10%' },
              proteins: { bottom: '25%', right: '10%' },
              carbs: { top: '25%', right: '10%' }
            };
            const pos = positions[group.id as keyof typeof positions];

            return (
              <div
                key={group.id}
                className={`absolute transition-all duration-300 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                style={pos}
              >
                <div className={`flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-2 ${
                  group.color.replace('bg', 'border').replace('500', '200')
                }`}>
                  <div className={`p-2 rounded-lg ${group.color.replace('500', '100')}`}>
                    {group.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{group.name}</p>
                    <p className={`text-sm ${group.color.replace('bg', 'text')}`}>
                      {group.percentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Borde decorativo y sombra interior */}
          <div className="absolute inset-0 rounded-full border-8 border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
          
          {/* Centro del plato */}
          <div className="absolute inset-[15%] rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-4 border-gray-50 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
                {hoveredGroup ? foodGroups.find(g => g.id === hoveredGroup)?.icon : foodGroups[0].icon}
              </div>
              <p className="text-sm font-medium text-gray-600">
                {hoveredGroup 
                  ? foodGroups.find(g => g.id === hoveredGroup)?.name 
                  : 'Método del Plato'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}